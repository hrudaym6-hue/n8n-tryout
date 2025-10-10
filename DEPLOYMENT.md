# CardDemo Application - VM Deployment Guide

## Overview
This guide explains how to deploy the CardDemo application on a VM and access it from external PCs.

## Docker Configuration

### Security: Backend Port Isolation
The backend service does NOT expose port 3000 directly to prevent unauthorized access. All API requests must go through the nginx reverse proxy at port 80.

**Architecture:**
```
External PC -> VM:80 (nginx) -> backend:3000 (internal Docker network only)
```

### CORS Configuration for External Access
When deploying to a VM that will be accessed from external PCs, you need to configure the allowed origins.

**Steps:**
1. Open `docker-compose.yml`
2. Find the `ALLOWED_ORIGINS` environment variable under the `backend` service
3. Update it to include your VM's IP address or hostname:
   ```yaml
   - ALLOWED_ORIGINS=http://192.168.1.100,http://192.168.1.100:80,http://your-vm-hostname
   ```
4. Replace `192.168.1.100` with your actual VM IP address
5. You can add multiple origins separated by commas

**Example for VM at IP 192.168.1.100:**
```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - SESSION_SECRET=your-secure-secret-here
  - FRONTEND_URL=http://192.168.1.100
  - ALLOWED_ORIGINS=http://192.168.1.100,http://192.168.1.100:80,http://localhost,http://localhost:80
```

## Deployment Steps

1. Clone the repository on your VM:
   ```bash
   git clone https://github.com/hrudaym6-hue/n8n-tryout.git
   cd n8n-tryout
   ```

2. Update `docker-compose.yml`:
   - Update `ALLOWED_ORIGINS` to include your VM's IP address (as shown above)
   - Update `SESSION_SECRET` to a secure random string
   - Update `FRONTEND_URL` to your VM's IP address (optional)

3. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

4. Verify containers are running:
   ```bash
   docker ps
   ```
   You should see `carddemo-frontend` and `carddemo-backend` running.

5. Check logs if needed:
   ```bash
   docker-compose logs -f
   ```

## Accessing the Application

### From External PCs
- **Frontend**: `http://YOUR_VM_IP` (port 80)
- **Example**: `http://192.168.1.100`

### API Endpoints
- **Backend API**: Accessible only through nginx proxy at `http://YOUR_VM_IP/api/*`
- **Health check**: `http://YOUR_VM_IP/api/health`
- **Direct backend access**: Intentionally blocked for security (port 3000 not exposed)

### From the VM Itself (localhost)
- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost/api/*`

## Default Credentials

- **Admin User**: `ADMIN001` / `admin123`

You can create additional users by registering through the application's registration page.

## Security Considerations

1. **Backend Port Isolation**: The backend service is not directly accessible from outside the Docker network. All requests must go through nginx.

2. **Session Secret**: Always change the `SESSION_SECRET` to a secure random string in production.

3. **CORS Configuration**: Only add trusted origins to `ALLOWED_ORIGINS`. Don't use `*` (allow all) in production.

4. **Firewall**: Ensure your VM's firewall allows incoming connections on port 80.

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console when accessing from external PCs:

1. **Verify ALLOWED_ORIGINS** includes the exact URL you're using:
   ```bash
   docker-compose logs backend | grep ALLOWED_ORIGINS
   ```

2. **Include both with and without port**:
   ```yaml
   - ALLOWED_ORIGINS=http://192.168.1.100,http://192.168.1.100:80
   ```

3. **Restart containers after changes**:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

4. **Check browser console** for the exact origin being blocked:
   - Press F12 to open developer tools
   - Go to Console tab
   - Look for CORS error messages
   - Add that exact origin to ALLOWED_ORIGINS

### Cannot Access Application

1. **Check if containers are running**:
   ```bash
   docker ps
   ```
   Both `carddemo-frontend` and `carddemo-backend` should be listed.

2. **Check logs for errors**:
   ```bash
   docker-compose logs -f
   ```

3. **Verify firewall allows port 80**:
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   ```

4. **Test from VM itself first**:
   ```bash
   curl -I http://localhost
   curl -I http://localhost/api/health
   ```

### Login/Registration Not Working

1. **Check backend logs**:
   ```bash
   docker-compose logs backend
   ```

2. **Verify session configuration**:
   - Session cookies must have proper domain/path settings
   - Browser must accept cookies

3. **Check browser console** for JavaScript errors

4. **Verify backend API is reachable**:
   ```bash
   curl http://YOUR_VM_IP/api/health
   ```

### Backend Connection Refused

If you see "Connection refused" errors:

1. **Verify you're NOT trying to access backend directly on port 3000**:
   - ❌ Wrong: `http://YOUR_VM_IP:3000/api/health`
   - ✅ Correct: `http://YOUR_VM_IP/api/health`

2. **Check nginx is proxying correctly**:
   ```bash
   docker-compose logs frontend
   ```

3. **Verify backend is running**:
   ```bash
   docker-compose ps backend
   ```

## Updating the Application

To update the application after making code changes:

```bash
cd n8n-tryout
git pull
docker-compose down
docker-compose up -d --build
```

## Stopping the Application

```bash
docker-compose down
```

To also remove volumes (will delete all data):
```bash
docker-compose down -v
```

## Architecture Details

### Network Configuration
- All services run in the `carddemo-network` Docker bridge network
- Frontend container exposes port 80 to the host
- Backend container does NOT expose any ports to the host
- Backend is accessible to frontend via internal DNS name `backend:3000`

### nginx Reverse Proxy
The frontend nginx configuration proxies API requests:
- Requests to `/api/*` are forwarded to `http://backend:3000/api/*`
- All other requests serve the Angular application
- Enables CORS by setting appropriate headers

### Session Management
- Sessions are stored in-memory on the backend
- Session cookie is httpOnly and secure
- Sessions expire after 24 hours of inactivity
- No database required for authentication

## Production Recommendations

1. **Use HTTPS**: Set up SSL/TLS certificates (Let's Encrypt, etc.)
2. **Strong Session Secret**: Use a cryptographically secure random string
3. **Restrict CORS**: Only allow specific trusted origins
4. **Regular Updates**: Keep Docker images and dependencies up to date
5. **Monitoring**: Set up logging and monitoring for production use
6. **Backups**: If you add persistent storage later, implement regular backups
7. **Resource Limits**: Configure Docker resource limits for containers

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Review this deployment guide
3. Check the main repository README
4. Open an issue on GitHub
