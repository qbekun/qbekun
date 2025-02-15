const API_URL = 'https://text.pollinations.ai/';
const IMAGE_API_URL = 'https://image.pollinations.ai/prompt/';

let chatHistory = [];

const modelConfigs = {
  'flux': { name: 'Flux (Default)', strength: 1.0 },
  'turbo': { name: 'Turbo', strength: 0.9 }
};

const promptInput = document.getElementById('promptInput');
const enhanceBtn = document.getElementById('enhanceBtn');
const generateBtn = document.getElementById('generateBtn');
const chatHistoryDiv = document.getElementById('chatHistory');
const imageResults = document.getElementById('imageResults');
const modelSelect = document.getElementById('modelSelect');
const imageCountSelect = document.getElementById('imageCountSelect');

enhanceBtn.addEventListener('click', enhancePrompt);
generateBtn.addEventListener('click', generateImages);

async function enhancePrompt() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  enhanceBtn.disabled = true;
  const enhanceSpinner = enhanceBtn.querySelector('.spinner');
  const enhanceIcon = enhanceBtn.querySelector('.enhance-icon');
  enhanceSpinner.classList.remove('hidden');
  enhanceIcon.classList.add('hidden');
  
  try {
    const messages = [
      {
        role: "system",
        content: "You are a prompt engineering expert specializing in creating detailed, artistic image generation prompts. Your role is to enhance prompts by adding artistic style, mood, lighting, composition, and technical details. Keep responses concise and focused on the enhanced prompt only."
      },
      {
        role: "user",
        content: `Enhance this image prompt with artistic details and technical specifications: ${prompt}`
      }
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: "openai",
        seed: Math.floor(Math.random() * 1000),
        jsonMode: false
      })
    });

    const enhancedPrompt = await response.text();
    
    chatHistory.push({
      role: "user",
      content: prompt
    });
    chatHistory.push({
      role: "assistant",
      content: enhancedPrompt
    });

    displayChatMessage(prompt, enhancedPrompt);
    promptInput.value = enhancedPrompt;
    chatHistoryDiv.classList.add('show');

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to enhance prompt. Please try again.');
  } finally {
    enhanceBtn.disabled = false;
    enhanceSpinner.classList.add('hidden');
    enhanceIcon.classList.remove('hidden');
  }
}

function displayChatMessage(original, enhanced) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50';
  messageDiv.innerHTML = `
    <div class="text-gray-400 mb-2">Original: ${original}</div>
    <div class="text-green-400">Enhanced: ${enhanced}</div>
  `;
  chatHistoryDiv.appendChild(messageDiv);
}

async function generateImages() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  const generateSpinner = generateBtn.querySelector('.spinner');
  const generateIcon = generateBtn.querySelector('.generate-icon');
  generateSpinner.classList.remove('hidden');
  generateIcon.classList.add('hidden');
  generateBtn.disabled = true;
  
  // Clear previous results
  imageResults.innerHTML = '';
  imageResults.classList.remove('show');
  imageResults.classList.remove('hidden');
  
  // Force a reflow to ensure the animation plays
  void imageResults.offsetWidth;
  
  imageResults.classList.add('show');
  
  const selectedModel = modelSelect.value;
  const imageCount = parseInt(imageCountSelect.value);
  const modelConfig = modelConfigs[selectedModel];
  
  const imagePromises = [];
  
  for (let i = 0; i < imageCount; i++) {
    const imageContainer = createImageContainer(i);
    imageResults.appendChild(imageContainer);
    
    const promise = generateSingleImage(prompt, imageContainer, modelConfig);
    imagePromises.push(promise);
  }
  
  try {
    await Promise.all(imagePromises);
  } catch (error) {
    console.error('Error generating images:', error);
  } finally {
    generateBtn.disabled = false;
    generateSpinner.classList.add('hidden');
    generateIcon.classList.remove('hidden');
  }
  
  // Smooth scroll to results
  setTimeout(() => {
    imageResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function createImageContainer(index) {
  const container = document.createElement('div');
  container.className = 'relative rounded-xl overflow-hidden shadow-2xl bg-gray-800/30 group';
  container.innerHTML = `
    <div class="loading-overlay absolute inset-0 flex items-center justify-center bg-gray-800/90 backdrop-blur-sm z-10">
      <div class="flex items-center space-x-3">
        <div class="spinner"></div>
        <span class="text-lg">Generating image ${index + 1}...</span>
      </div>
    </div>
    <img class="w-full rounded-xl generated-image" src="" alt="Generated image ${index + 1}">
    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    </div>
  `;
  return container;
}

async function generateSingleImage(prompt, container, modelConfig) {
  const seed = Math.floor(Math.random() * 1000000);
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Get width and height values
  const width = document.getElementById('widthInput').value;
  const height = document.getElementById('heightInput').value;
  
  // Build URL with optional parameters
  let imageUrl = `${IMAGE_API_URL}${encodedPrompt}?nologo=true&seed=${seed}&model=${modelSelect.value}`;
  
  if (width) {
    imageUrl += `&width=${width}`;
  }
  if (height) {
    imageUrl += `&height=${height}`;
  }

  try {
    const generatedImage = container.querySelector('.generated-image');
    const loadingOverlay = container.querySelector('.loading-overlay');
    
    generatedImage.src = imageUrl;
    
    await new Promise((resolve, reject) => {
      generatedImage.onload = () => {
        // Ensure the image has loaded before showing it
        setTimeout(() => {
          generatedImage.classList.add('loaded');
          loadingOverlay.style.opacity = '0';
          setTimeout(() => {
            loadingOverlay.style.display = 'none';
          }, 300);
          resolve();
        }, 100);
      };
      generatedImage.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  } catch (error) {
    console.error('Error loading image:', error);
    container.innerHTML = '<div class="p-4 text-red-400">Failed to generate image</div>';
  }
}

// Add Advanced Options Toggle
const advancedOptionsBtn = document.getElementById('advancedOptionsBtn');
const advancedOptions = document.getElementById('advancedOptions');
const advancedChevron = document.getElementById('advancedChevron');

advancedOptionsBtn.addEventListener('click', () => {
  advancedOptions.classList.toggle('hidden');
  advancedChevron.classList.toggle('rotate-90');
});

// Validate width and height inputs
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');

function validateDimension(input) {
  let value = parseInt(input.value);
  if (value < 64) {
    value = 64;
  }
  // Round to nearest multiple of 64
  value = Math.round(value / 64) * 64;
  input.value = value || '';
}

widthInput.addEventListener('blur', () => validateDimension(widthInput));
heightInput.addEventListener('blur', () => validateDimension(heightInput));

// Auto-resize textarea
promptInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

// Keypress handling
promptInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    generateImages();
  } else if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault();
    enhancePrompt();
  }
});

function setupImagePreview() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');

  // Delegate event listener to handle dynamic images
  imageResults.addEventListener('click', (e) => {
    const image = e.target.closest('.generated-image');
    if (image) {
      openModal(image.src);
    }
  });

  closeModal.addEventListener('click', closeModalHandler);

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalHandler();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModalHandler();
    }
  });
}

function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  
  document.body.classList.add('modal-open');
  modal.classList.remove('hidden');
  
  // Force reflow
  void modal.offsetWidth;
  
  modal.classList.add('show');
  modalImage.src = imageSrc;
  
  // Wait for image to load before showing
  modalImage.onload = () => {
    modalImage.classList.add('show');
  };
}

function closeModalHandler() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  
  modalImage.classList.remove('show');
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  
  // Hide modal after transition
  setTimeout(() => {
    modal.classList.add('hidden');
    modalImage.src = '';
  }, 300);
}

// Initialize image preview functionality
setupImagePreview();

function setupPresets() {
  const presets = {
    'cinematic': 'cinematic, dramatic lighting, high detail, 8k',
    'anime': 'anime style, vibrant colors, detailed, studio ghibli inspired',
    'portrait': 'portrait, professional photography, bokeh, natural lighting',
    'fantasy': 'fantasy art, magical, ethereal, detailed environment',
    'abstract': 'abstract art, contemporary, vibrant colors, geometric'
  };

  const presetsContainer = document.getElementById('presets');
  
  Object.entries(presets).forEach(([name, suffix]) => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn px-4 py-2 rounded-lg text-sm capitalize';
    btn.textContent = name;
    btn.addEventListener('click', () => {
      const currentPrompt = promptInput.value.trim();
      promptInput.value = currentPrompt ? `${currentPrompt}, ${suffix}` : suffix;
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    presetsContainer.appendChild(btn);
  });
}

// Initialize new features
setupPresets();

// Update the keyboard shortcuts hint
document.querySelectorAll('[data-shortcut]').forEach(element => {
  const shortcut = element.dataset.shortcut;
  if (shortcut) {
    const hint = document.createElement('span');
    hint.className = 'keyboard-shortcut';
    hint.textContent = shortcut;
    element.appendChild(hint);
  }
});