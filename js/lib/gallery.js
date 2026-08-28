/* ==========================================================================
   Polaroid Gallery & Memory Storage Engine
   ========================================================================== */

export class GalleryManager {
    constructor() {
        this.memories = []; // Array of { id, type: 'photo'|'video', dataUrl, caption, timestamp }
        this.badgeCountElem = document.getElementById('gallery-count-badge');
        this.galleryGridElem = document.getElementById('gallery-grid');
    }

    addPhoto(dataUrl, caption = "Magical Memory ✨") {
        const item = {
            id: Date.now(),
            type: 'photo',
            dataUrl,
            caption,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rotation: (Math.random() - 0.5) * 8
        };
        this.memories.unshift(item);
        this.updateUI();
    }

    addVideo(videoBlob, caption = "Magical Spell Video 🎬") {
        const videoUrl = URL.createObjectURL(videoBlob);
        const item = {
            id: Date.now(),
            type: 'video',
            dataUrl: videoUrl,
            caption,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rotation: (Math.random() - 0.5) * 8
        };
        this.memories.unshift(item);
        this.updateUI();
    }

    deleteItem(id) {
        this.memories = this.memories.filter(m => m.id !== id);
        this.updateUI();
    }

    updateUI() {
        if (this.memories.length > 0) {
            this.badgeCountElem.textContent = this.memories.length;
            this.badgeCountElem.classList.remove('hidden');
        } else {
            this.badgeCountElem.classList.add('hidden');
        }

        if (this.memories.length === 0) {
            this.galleryGridElem.innerHTML = `
                <div class="empty-gallery-msg handwritten-text">
                    📸 No memories saved yet! Take photos or videos with the shutter button to save memories here.
                </div>
            `;
            return;
        }

        this.galleryGridElem.innerHTML = '';
        this.memories.forEach(m => {
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.style.setProperty('--r', m.rotation);

            const mediaHtml = m.type === 'photo' 
                ? `<img src="${m.dataUrl}" class="polaroid-img" alt="Memory">`
                : `<video src="${m.dataUrl}" class="polaroid-img" controls></video>`;

            card.innerHTML = `
                ${mediaHtml}
                <div class="polaroid-caption">${m.caption} (${m.timestamp})</div>
                <div class="polaroid-actions">
                    <button class="polaroid-btn download-btn" title="Download">💾</button>
                    <button class="polaroid-btn delete-btn" title="Delete">🗑️</button>
                </div>
            `;

            // Bind Actions
            const dlBtn = card.querySelector('.download-btn');
            dlBtn.addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = m.dataUrl;
                a.download = `magical_wand_${m.id}.${m.type === 'photo' ? 'png' : 'webm'}`;
                a.click();
            });

            const delBtn = card.querySelector('.delete-btn');
            delBtn.addEventListener('click', () => {
                this.deleteItem(m.id);
            });

            this.galleryGridElem.appendChild(card);
        });
    }
}
