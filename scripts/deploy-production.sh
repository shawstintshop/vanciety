#!/bin/bash
# Production deployment script with automatic tagging and safety checks

set -e

echo "🚀 Vanciety Production Deployment"
echo "=================================="

# Safety checks
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Working directory not clean. Commit or stash changes first."
  exit 1
fi

# Run tests
echo "🧪 Running pre-deployment checks..."
pnpm run lint || { echo "❌ Lint failed"; exit 1; }
pnpm run typecheck || { echo "❌ TypeScript check failed"; exit 1; }
pnpm run build || { echo "❌ Build failed"; exit 1; }

# Tag this deployment
COMMIT=$(git rev-parse --short HEAD)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TAG="prod-${TIMESTAMP}-${COMMIT}"

echo "🏷️  Tagging deployment: $TAG"
git tag -a "$TAG" -m "Production deploy: $TIMESTAMP"
git push origin "$TAG"

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo "   Tag: $TAG"
echo "   URL: https://primaryapp.vercel.app"
echo ""
echo "To rollback:"
echo "   git checkout $TAG"
echo "   vercel --prod --yes"
