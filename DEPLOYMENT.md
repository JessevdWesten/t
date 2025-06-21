# 🚀 Deployment Guide: Smart Fitness & Nutrition Coach

Deze handleiding helpt je om je fitness app gratis te deployen met de beste cloudservices.

## 📋 Deployment Strategie

**Gratis Services Stack:**
- **Backend**: Render (gratis tier)
- **Frontend**: Render Static Sites (gratis)
- **Database**: Supabase PostgreSQL (gratis tier)
- **CI/CD**: GitHub Actions (gratis voor publieke repos)

## 🛠 Stap 1: GitHub Repository Setup

### 1.1 Push je code naar GitHub

```bash
# In je project directory
git init
git add .
git commit -m "Initial commit: Smart Fitness & Nutrition Coach"

# Maak een nieuwe repository op GitHub, dan:
git remote add origin https://github.com/jouw-username/fitnesstracker.git
git branch -M main
git push -u origin main
```

## 🗄️ Stap 2: Database Setup met Supabase

### 2.1 Maak een Supabase account
1. Ga naar [supabase.com](https://supabase.com)
2. Klik "Start your project"
3. Sign up met GitHub

### 2.2 Maak een nieuw project
1. Klik "New Project"
2. **Name**: `fitnesstracker-db`
3. **Database Password**: Genereer een sterk wachtwoord (sla dit op!)
4. **Region**: Kies het dichtstbijzijnde (bijv. "West EU (Ireland)")
5. Klik "Create new project"

### 2.3 Verkrijg de connection string
1. Ga naar **Settings** → **Database**
2. Scroll naar "Connection string"
3. Kopieer de **URI** connection string
4. Vervang `[YOUR-PASSWORD]` met je database wachtwoord
5. Sla deze op - je hebt hem nodig voor Render!

**Voorbeeld**: `postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`

## 🌐 Stap 3: Backend Deployment op Render

### 3.1 Maak een Render account
1. Ga naar [render.com](https://render.com)
2. Sign up met je GitHub account

### 3.2 Deploy je backend
1. Klik "New +" → "Web Service"
2. **Connect repository**: Kies je fitnesstracker repository
3. **Name**: `fitnesstracker-backend`
4. **Region**: Frankfurt (EU Central)
5. **Branch**: `main`
6. **Root Directory**: `backend`
7. **Runtime**: Python 3
8. **Build Command**: `pip install -r requirements.txt`
9. **Start Command**: `python seed_data.py && uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3.3 Environment Variables toevoegen
Scroll naar "Environment Variables" en voeg toe:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Je Supabase connection string |
| `SECRET_KEY` | Genereer een sterke key met [dit](https://www.lastpass.com/features/password-generator) |
| `DEBUG` | `false` |
| `ALLOWED_ORIGINS` | `https://fitnesstracker-frontend.onrender.com` |

### 3.4 Deploy
1. Klik "Create Web Service"
2. Wacht tot de deployment klaar is (5-10 minuten)
3. Noteer de URL (bijv. `https://fitnesstracker-backend.onrender.com`)

## 🎨 Stap 4: Frontend Deployment op Render

### 4.1 Deploy je frontend
1. Klik "New +" → "Static Site"
2. **Connect repository**: Kies dezelfde repository
3. **Name**: `fitnesstracker-frontend`
4. **Branch**: `main`
5. **Root Directory**: `frontend`
6. **Build Command**: `npm install && npm run build`
7. **Publish Directory**: `build`

### 4.2 Environment Variables
| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://fitnesstracker-backend.onrender.com/api` |

### 4.3 Deploy
1. Klik "Create Static Site"
2. Wacht tot de deployment klaar is

## 🔄 Stap 5: GitHub Actions CI/CD Setup

### 5.1 Render Deploy Hook
1. Ga naar je backend service op Render
2. Ga naar **Settings** → **Deploy Hook**
3. Kopieer de Deploy Hook URL

### 5.2 GitHub Secrets
1. Ga naar je GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Klik "New repository secret"
4. **Name**: `RENDER_DEPLOY_HOOK_URL`
5. **Value**: Je Deploy Hook URL
6. Klik "Add secret"

### 5.3 Test je CI/CD
1. Maak een kleine wijziging in je code
2. Commit en push naar main
3. Ga naar **Actions** tab op GitHub
4. Bekijk je deployment workflow

## ✅ Stap 6: Verificatie

### 6.1 Test je live applicatie
1. Ga naar je frontend URL (bijv. `https://fitnesstracker-frontend.onrender.com`)
2. Maak een nieuw account aan
3. Log in en test de functionaliteit

### 6.2 API Health Check
1. Ga naar `https://jouw-backend-url.onrender.com/docs`
2. Test enkele API endpoints

## 🔧 Belangrijke Deployment Configuraties

### Backend Aanpassingen
De volgende bestanden zijn aangepast voor deployment:
- `backend/config.py`: Environment variable support
- `render.yaml`: Render deployment configuratie
- `.github/workflows/deploy.yml`: CI/CD pipeline

### Frontend Aanpassingen
- API URL wordt automatisch ingesteld via environment variables
- Build optimizatie voor productie

## 🚨 Troubleshooting

### Backend start niet
- **Controleer logs** in Render dashboard
- **Database connectie**: Verifieer DATABASE_URL
- **Dependencies**: Zorg dat requirements.txt compleet is

### Frontend kan niet connecten met backend
- **CORS errors**: Controleer ALLOWED_ORIGINS
- **API URL**: Verifieer REACT_APP_API_URL
- **Network**: Test backend URL handmatig

### Database issues
- **Connection timeout**: Supabase regio vs Render regio
- **Authentication**: Verifieer database wachtwoord
- **SSL**: Supabase vereist SSL connecties

## 📊 Resource Limieten (Gratis Tiers)

### Render
- **Web Services**: 1 gratis service
- **Static Sites**: Onbeperkt
- **Sleep**: Na 15 min inactiviteit
- **Build tijd**: 90 seconden max

### Supabase
- **Database**: 500MB opslag
- **API calls**: 50,000/maand
- **Auth users**: 50,000
- **Bandwidth**: 2GB

## 🔮 Next Steps

1. **Custom Domain**: Koppel je eigen domein
2. **Monitoring**: Stel health checks in
3. **Analytics**: Voeg Google Analytics toe
4. **Performance**: Optimaliseer loading times
5. **ML Integration**: Implementeer Phase 2 & 3 features

## 🎉 Gefeliciteerd!

Je Smart Fitness & Nutrition Coach app is nu live! 

**Je portfolio URLs:**
- **Frontend**: `https://fitnesstracker-frontend.onrender.com`
- **API Docs**: `https://fitnesstracker-backend.onrender.com/docs`
- **GitHub**: `https://github.com/jouw-username/fitnesstracker`

Perfect om te laten zien aan potentiële werkgevers! 🚀 