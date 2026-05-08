## 1. Next.js Configuration

- [x] 1.1 Add `output: 'standalone'` to `next.config.ts`
- [x] 1.2 Verify `.next/standalone/server.js` exists after running `pnpm build`

## 2. Docker Build Files

- [x] 2.1 Create `.dockerignore` excluding `node_modules`, `.next/cache`, `.git`, `*.env*`, and editor artifacts
- [x] 2.2 Create `Dockerfile` with three stages: `deps` (pnpm install), `builder` (next build), `runner` (standalone copy)
- [x] 2.3 Runner stage: create `nextjs` user (uid 1001) and set `USER nextjs`
- [x] 2.4 Runner stage: copy `.next/standalone`, `.next/static`, and `public/` into the correct paths
- [x] 2.5 Runner stage: set `CMD ["node", "server.js"]` as the entrypoint

## 3. Environment Variable Documentation

- [x] 3.1 Add `HOSTNAME` and `PORT` to `.env.local.example` with comments noting they are required in container deployments

## 4. Local Verification

- [x] 4.1 Build the image locally: `docker build -t kafe-web .`
- [x] 4.2 Run the container: `docker run -e HOSTNAME=0.0.0.0 -e PORT=3000 -p 3000:3000 kafe-web`
- [x] 4.3 Confirm the app loads in the browser and API calls reach the backend
- [x] 4.4 Confirm the running process is not root: `docker exec <id> whoami`
