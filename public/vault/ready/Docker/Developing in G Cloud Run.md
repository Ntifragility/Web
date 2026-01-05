---
title: Developing in G Cloud Run
subtitle: Step-by-step guide to deploying containers with gcloud
date: 2026-01-03
image: https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&q=80&w=1200
---

1. **Step 1: Authenticate with Google Cloud**
```bash
	# Open your command prompt and authenticate
	gcloud auth login
	
	# Set your project (replace YOUR_PROJECT_ID with your actual project ID)
	gcloud config set project YOUR_PROJECT_ID
	
	# If you don't have a project, create one:
	gcloud projects create YOUR_PROJECT_ID --name="Electrical Calculator"
```

2. **Step 2: Enable required APIs**
```bash
	# Enable Cloud Run and Container Registry APIs 
	gcloud services enable run.googleapis.com 
	gcloud services enable cloudbuild.googleapis.com 
	gcloud services enable containerregistry.googleapis.com
```

3. **Step 3: Configure Docker for Google Cloud**
```bash
	# Configure Docker to use gcloud as credential helper 
	gcloud auth configure-docker
```

4. **Step 4: Tag and push your image to Google Container Registry**
```bash
	# Tag your local image for Google Container Registry
	# Format: gcr.io/PROJECT_ID/IMAGE_NAME:TAG
	docker tag electrical-calculator gcr.io/YOUR_PROJECT_ID/electrical-calculator:latest
	
	# Push the image to Google Container Registry
	docker push gcr.io/YOUR_PROJECT_ID/electrical-calculator:latest
```

5. **Step 5: Deploy to Cloud Run**
```bash
	# Deploy your container to Cloud Run (1 line)
	gcloud run deploy electrical-calculator \
	  --image gcr.io/YOUR_PROJECT_ID/electrical-calculator:latest \
	  --platform managed \
	  --region us-central1 \
	  --allow-unauthenticated \
	  --port 8501
```

6. **Step 6: Access your deployed application**
```bash
	https://electrical-calculator-xxxxx-uc.a.run.app
```
   