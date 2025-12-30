# 🎨 ARCHIVIZ® Local AI Setup Guide

Complete guide to run ARCHIVIZ Render Studio with **100% Local AI** or free cloud options.

---

## 🚀 Quick Start (Recommended: Hugging Face)

**Best for architectural rendering - Generates actual images!**

### Step 1: Get FREE Hugging Face API Key
1. Go to https://huggingface.co/join (sign up - it's free!)
2. Go to Settings → Access Tokens: https://huggingface.co/settings/tokens
3. Click "New token" → Name it "archiviz" → Role: "Read" → Create
4. Copy your token

### Step 2: Configure
Open `.env.local` and update:
```bash
AI_PROVIDER=huggingface
HF_API_KEY=hf_your_actual_token_here
```

### Step 3: Run
```bash
npm run dev
```

**Done!** 🎉 Open http://localhost:5173 and start rendering!

---

## 💎 Gemini API Setup (New!)

**Best for Image-to-Image Rendering & Architectural Visualization**

### Step 1: Get FREE Google API Key
1. Go to https://aistudio.google.com/app/apikey (Google AI Studio)
2. Click "Create API Key"
3. Copy your key

### Step 2: Configure
Open `.env.local` and add:
```bash
VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

### Step 3: Select in App
1. Open Settings in the app
2. Select **Gemini** provider
3. (Optional) Paste your key in the settings if not using .env


---

## 🏠 100% Local Options

### Option A: Ollama + Stable Diffusion WebUI

**What You Need:**
- Ollama (for image analysis)
- Automatic1111 Stable Diffusion WebUI (for image generation)

**Setup Steps:**

#### 1. Install Ollama
```bash
# Download from: https://ollama.com
# Or via command line:
curl -fsSL https://ollama.com/install.sh | sh

# Pull vision model
ollama pull llava:13b
```

#### 2. Install Stable Diffusion WebUI
```bash
# Clone repo
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# Run (it will auto-install dependencies)
# Windows:
./webui-user.bat --api

# Mac/Linux:
./webui.sh --api
```

#### 3. Update App to Use Both
Currently, the app needs modification to chain Ollama + SD WebUI. Create custom service:

```typescript
// services/hybridLocalAI.ts
// 1. Analyze image with Ollama
// 2. Enhance prompt
// 3. Generate with SD WebUI API
// 4. Return result
```

---

### Option B: ComfyUI (Most Powerful)

**Best for:** Maximum control, custom workflows, professional results

#### 1. Install ComfyUI
```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install -r requirements.txt

# Download models (place in ComfyUI/models/checkpoints/)
# Recommended: Stable Diffusion XL, Realistic Vision
```

#### 2. Create img2img Workflow
- Load ComfyUI: `python main.py`
- Open http://localhost:8188
- Create workflow:
  1. Load Image node
  2. CLIP Text Encode (positive prompt)
  3. CLIP Text Encode (negative prompt)
  4. KSampler (img2img settings)
  5. VAE Decode
  6. Save Image

#### 3. Use ComfyUI API
```bash
# Enable API in ComfyUI settings
# Update .env.local:
AI_PROVIDER=comfyui
COMFYUI_BASE_URL=http://localhost:8188
```

---

### Option C: LM Studio (Vision Analysis Only)

**Note:** LM Studio vision models can analyze images but NOT generate new ones. Use for prompt enhancement only.

#### 1. Install LM Studio
- Download: https://lmstudio.ai
- Install and launch

#### 2. Load Vision Model
- Search for "llava" in model library
- Download: `llava-v1.6-34b`
- Start server in LM Studio

#### 3. Configure
```bash
AI_PROVIDER=lmstudio
LMSTUDIO_BASE_URL=http://localhost:1234
LMSTUDIO_MODEL=llava-v1.6-34b
```

---

## 📊 Comparison Table

| Option | Image Generation | Speed | Quality | Cost | Setup Difficulty |
|--------|-----------------|-------|---------|------|------------------|
| **Hugging Face** | ✅ Yes | Fast | High | Free* | ⭐ Easy |
| **Ollama + SD WebUI** | ✅ Yes | Medium | Very High | Free | ⭐⭐⭐ Medium |
| **ComfyUI** | ✅ Yes | Slow | Excellent | Free | ⭐⭐⭐⭐ Hard |
| **LM Studio** | ❌ No | N/A | N/A | Free | ⭐⭐ Easy |
| **Ollama** | ❌ No | N/A | N/A | Free | ⭐⭐ Easy |

*Hugging Face free tier has rate limits. For production, consider Pro ($9/month).

---

## 🎯 Recommended Models

### For Hugging Face:
1. **stabilityai/stable-diffusion-xl-base-1.0** (Default - Best balance)
2. **runwayml/stable-diffusion-v1-5** (Faster, good quality)
3. **stabilityai/stable-diffusion-2-1** (Alternative)

### For Local Stable Diffusion:
1. **Stable Diffusion XL** (8GB VRAM+)
2. **Realistic Vision v5** (Photorealistic renders)
3. **ArchitectureExterior** (Specialized for buildings)
4. **Epic Photogasm** (High detail architectural renders)

### For Ollama (Analysis Only):
1. **llava:13b** (Balanced)
2. **llava:34b** (Better descriptions, needs 24GB RAM)
3. **bakllava** (Alternative vision model)

---

## 🔧 Troubleshooting

### Hugging Face: "Model is loading"
- Models cold start. Wait 30-60 seconds and retry
- Or upgrade to Pro for instant availability

### Ollama: "Connection refused"
```bash
# Make sure Ollama is running:
ollama serve

# Check status:
curl http://localhost:11434/api/tags
```

### SD WebUI: API not accessible
```bash
# Restart with API enabled:
./webui.sh --api --listen

# Test API:
curl http://localhost:7860/sdapi/v1/sd-models
```

### VRAM Issues (GPU Memory)
- SD XL needs 8GB+ VRAM
- SD 1.5 works with 4GB
- Use `--medvram` or `--lowvram` flags for SD WebUI:
  ```bash
  ./webui.sh --api --medvram
  ```

### CPU-Only (No GPU)
```bash
# SD WebUI with CPU:
./webui.sh --api --use-cpu all --skip-torch-cuda-test

# ComfyUI with CPU:
python main.py --cpu
```

**Warning:** CPU rendering is 10-50x slower!

---

## 🎨 Advanced: Custom Workflows

### Hybrid Setup (Best Quality)
1. **Ollama**: Analyze uploaded sketch
2. **Prompt Enhancement**: Extract architectural details
3. **Stable Diffusion**: Generate photorealistic render
4. **Upscaling**: Use Real-ESRGAN for 4K output

### Professional Pipeline
```
Input Sketch
    ↓
Ollama (analyze)
    ↓
Enhanced Prompt
    ↓
SD XL (img2img)
    ↓
ControlNet (maintain structure)
    ↓
Upscaler (4K/8K)
    ↓
Final Render
```

---

## 📦 GPU Requirements

| Setup | Minimum | Recommended | Optimal |
|-------|---------|-------------|---------|
| **Hugging Face** | Any | Any | Any |
| **SD 1.5** | 4GB VRAM | 6GB VRAM | 8GB VRAM |
| **SD XL** | 6GB VRAM | 10GB VRAM | 12GB+ VRAM |
| **ComfyUI + Workflows** | 8GB VRAM | 12GB VRAM | 24GB VRAM |

**No GPU?** Use Hugging Face API or CPU mode (slow but works).

---

## 🆘 Support & Resources

### Documentation:
- Stable Diffusion WebUI: https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki
- ComfyUI: https://github.com/comfyanonymous/ComfyUI
- Ollama: https://ollama.com/docs
- Hugging Face: https://huggingface.co/docs/api-inference

### Communities:
- r/StableDiffusion
- r/LocalLLaMA
- ComfyUI Discord

### Contact Developer:
- Email: mhyeatz@outlook.com
- GitHub: github.com/me-yeatz

---

## 🎁 Tips for Best Results

1. **High-Quality Input**: Upload clear, well-lit sketches
2. **Correct Perspective**: Ensure sketch has proper architectural perspective
3. **Detailed Prompts**: Environment presets help but add custom details
4. **Multiple Attempts**: Run 2-3 times, pick best result
5. **Seed Control**: Save seed numbers for reproducible results
6. **Strength Setting**: 0.5-0.75 for sketch transformation

---

**Happy Rendering!** 🏛️✨

Built with passion for local AI by M. Nor Hidayat (me.yeatz)
