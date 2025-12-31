import { defineConfig } from 'vite'; // Helps with autocomplete and type-safety for the config object
import path from 'path'; // A Node.js module used to handle file paths reliably across different Operating Systems
import { builtinModules } from 'module';

// This is the main configuration that Vite reads when you run your dev server or build your app
export default defineConfig({
    resolve: {
        // The 'alias' object defines "nicknames" for specific folders in your project
        alias: {
            /** * This line creates the '@' alias:
             * 1. '@': The symbol we want to use in our code.
             * 2. __dirname: The absolute path to the directory containing this config file.
             * 3. path.resolve: Safely joins the current directory with the './src' folder.
             * Result: '@' now points directly to your project's 'src' folder.
             */
            '@': path.resolve(__dirname, './src'),

            /*__dirname is a special variable in Node.js that gives us the absolute directory path 
            Start from the folder where this vite.config.ts file lives (__dirname), and then look for the ./src folder inside it
            It needs to have @types/node installed because browsers don't have a path module or a __dirname variable
            and typescript doesn't know what __dirname is.
            */
        },
    },
    server: {
        port: 5173, // http://localhost:5173/
        strictPort: true // only will go to the port 5173 (anything else)
    }

});