import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

interface VaultEntry {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    image: string;
    markdownPath: string;
    category: string;
}

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAULT_PATH = path.join(__dirname, '../public/vault');
const OUTPUT_PATH = path.join(__dirname, '../src/data/vault-manifest.json');

// Default placeholder image if none found
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600';

// Recursively find all .md files (works with junctions)
function findMarkdownFiles(dir: string, baseDir: string = dir): string[] {
    const results: string[] = [];

    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            // Skip .obsidian folder
            if (entry.name === '.obsidian') continue;

            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                results.push(...findMarkdownFiles(fullPath, baseDir));
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                // Get relative path from base directory
                const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
                results.push(relativePath);
            }
        }
    } catch (err) {
        console.error(`  ⚠️  Error reading ${dir}:`, err);
    }

    return results;
}

async function scanVault(): Promise<void> {
    console.log('🔍 Scanning Obsidian vault...');
    console.log(`   Vault path: ${VAULT_PATH}`);

    // Find all .md files recursively (custom function for junction support)
    const files = findMarkdownFiles(VAULT_PATH);

    console.log(`   Found ${files.length} markdown files.`);

    const entries: VaultEntry[] = [];

    for (const file of files) {
        const fullPath = path.join(VAULT_PATH, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const stats = fs.statSync(fullPath);

        // Parse front matter
        const { data: frontMatter, content: body } = matter(content);

        // Skip drafts
        if (frontMatter.draft === true) {
            console.log(`  ⏭️  Skipping draft: ${file}`);
            continue;
        }

        // Derive title: front matter > filename
        const filename = path.basename(file, '.md');
        const title = frontMatter.title || filename;

        // Derive subtitle
        const subtitle = frontMatter.subtitle || '';

        // Derive date: front matter > file modification time
        const date = frontMatter.date
            ? new Date(frontMatter.date).toISOString().split('T')[0]
            : stats.mtime.toISOString().split('T')[0];

        // Derive image: front matter > first image in content > default
        let image = frontMatter.image || DEFAULT_IMAGE;
        if (!frontMatter.image) {
            // Try to find first image in markdown content
            const imgMatch = body.match(/!\[\[([^\]|]+)/);
            if (imgMatch) {
                const imgName = imgMatch[1].trim();
                // Construct path relative to the post's folder
                const postFolder = path.dirname(file);
                // Check if image is in same folder or img subfolder
                image = `/vault/${postFolder}/img/${encodeURIComponent(imgName)}`;
            }
        }

        // Derive category from folder structure
        const parts = file.split('/');
        const category = parts.length > 1 ? parts[0] : 'General';

        // Generate unique ID from path
        const id = file.replace(/\.md$/, '').replace(/[\/\s]/g, '-').toLowerCase();

        entries.push({
            id,
            title,
            subtitle,
            date,
            image,
            markdownPath: `/vault/${file}`,
            category
        });

        console.log(`  ✅ Found: ${title}`);
    }

    // Sort by date (newest first)
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Write manifest
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2));
    console.log(`\n📝 Generated manifest with ${entries.length} entries.`);
    console.log(`   Output: ${OUTPUT_PATH}`);
}

scanVault().catch(console.error);
