# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Deploying to Coolify

This project is configured for deployment on a Coolify v4 instance.

### 1. Prerequisites

- A working Coolify v4 instance.
- A GitHub repository with your project code.

### 2. Setup in Coolify

1.  **Create a New Resource:**
    *   From your Coolify dashboard, create a new "Application" resource.
    *   Select your Git repository and branch.
    *   Coolify will detect the `docker-compose.yml` file. Select the `app` service to deploy.

2.  **Configure Build Settings:**
    *   **Build Pack:** Select `Docker Compose`.
    *   **Docker Compose File Location:** Set to `/docker-compose.yml`.

3.  **Set Environment Variables:**
    *   In the "Environment Variables" tab for your application, add the following secrets. These are essential for security and proper application function.
    *   `ADMIN_EMAIL`: The email address for the admin account (e.g., `admin@example.com`).
    *   `ADMIN_PASSWORD`: The password for the admin account.
    *   `SESSION_SECRET`: A long, random string used to secure user sessions. You can generate one with `openssl rand -base64 32`.

4.  **Configure Persistent Storage:**
    *   This application stores data (posts, media, settings, etc.) as JSON files. To prevent data loss on redeploy, you must set up a persistent volume.
    *   Go to the "Storage" tab for your application.
    *   Add a new "Volume".
    *   **Host Path:** This is the path on your server where the data will be stored (e.g., `/var/data/danadelola-appdata`). Coolify will manage this.
    *   **Container Path:** Set this to `/app/public/appdata`. This must match the volume path defined in the `docker-compose.yml` file.

5.  **Deploy:**
    *   Click the "Deploy" button. Coolify will clone your repository, build the Docker image using the multi-stage `Dockerfile`, and start the service defined in your `docker-compose.yml`.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
