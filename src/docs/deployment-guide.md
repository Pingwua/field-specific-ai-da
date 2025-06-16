# Deployment Guide for AI Data Refiner

This guide will walk you through deploying the AI Data Refiner application on an Ubuntu server. This is a step-by-step process that covers installing dependencies, configuring the server, and making your application accessible on the web.

## Prerequisites

- An Ubuntu server (Ubuntu 20.04 LTS or newer recommended)
- Domain name (optional, but recommended for production)
- Basic knowledge of Linux commands
- SSH access to your server

## Step 1: Server Setup

First, update your system and install required packages:

```bash
# Update package list and upgrade installed packages
sudo apt update
sudo apt upgrade -y

# Install Node.js (v18 or newer) and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install additional required packages
sudo apt install -y git nginx
```

## Step 2: Clone the Repository

```bash
# Create directory for the application
mkdir -p /var/www
cd /var/www

# Clone your repository (replace with your actual repository URL)
git clone https://github.com/yourusername/ai-data-refiner.git
cd ai-data-refiner
```

## Step 3: Install Dependencies and Build the Application

```bash
# Install dependencies
npm install

# Build the application for production
npm run build
```

## Step 4: Set Up Nginx as a Web Server

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/ai-data-refiner
```

Add the following configuration (adjust as needed):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # Replace with your domain

    root /var/www/ai-data-refiner/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site configuration:

```bash
sudo ln -s /etc/nginx/sites-available/ai-data-refiner /etc/nginx/sites-enabled/
sudo nginx -t  # Test the configuration
sudo systemctl restart nginx
```

## Step 5: Set Up a Process Manager (PM2)

PM2 will keep your application running:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your application (if you need a server component)
# For static sites, you can skip this step
cd /var/www/ai-data-refiner
pm2 start npm --name "ai-data-refiner" -- run preview

# Configure PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

## Step 6: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will modify your Nginx configuration automatically
# Follow the prompts to complete the setup
```

## Step 7: Firewall Configuration

Ensure your firewall allows HTTP/HTTPS traffic:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 8: Testing Your Deployment

Visit your domain in a web browser to verify that your application is working correctly.

## Maintenance and Updates

To update your application:

```bash
cd /var/www/ai-data-refiner
git pull  # Pull the latest code
npm install  # Install any new dependencies
npm run build  # Rebuild the application
sudo systemctl restart nginx  # Restart Nginx
```

## Additional Configuration for API Integrations

If your AI Data Refiner needs to connect to external APIs, you should set up environment variables:

```bash
cd /var/www/ai-data-refiner
nano .env.production
```

Add your environment variables:

```
VITE_API_URL=https://your-api-url.com
VITE_OTHER_CONFIG=value
```

Then rebuild your application:

```bash
npm run build
```

## Troubleshooting

Common issues and solutions:

1. **Application not accessible**: Check Nginx logs at `/var/log/nginx/error.log`
2. **Permissions issues**: Ensure files are owned by the correct user with `sudo chown -R www-data:www-data /var/www/ai-data-refiner`
3. **CORS errors**: Configure your backend to allow your domain in CORS headers

## Security Considerations

1. **Regular updates**: Keep your server and dependencies updated
2. **Restrict access**: Configure your firewall properly
3. **Use HTTPS**: Always use SSL to encrypt data in transit
4. **Secure API keys**: Never expose sensitive keys in client-side code

For more advanced security requirements, consider implementing:

- Rate limiting
- Request validation
- Content Security Policy (CSP)
- IP filtering for admin access