import Phaser from 'phaser';
import { submitLevelRequest } from '../lib/firebase.js';

export default class CustomLevelRequestModal {
    constructor(scene, onClose) {
        this.scene = scene;
        this.onClose = onClose;
        this.domElement = null;
        this.overlay = null;

        this.createUI();
    }

    createUI() {
        const gameContainer = this.scene.game.canvas.parentElement || document.body;

        // Container Div
        const modalContainer = document.createElement('div');
        modalContainer.id = 'custom-level-modal-overlay';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100vw';
        modalContainer.style.height = '100vh';
        modalContainer.style.backgroundColor = 'rgba(26, 26, 46, 0.75)';
        modalContainer.style.display = 'flex';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.zIndex = '9999';
        modalContainer.style.backdropFilter = 'blur(4px)';
        modalContainer.style.opacity = '0';
        modalContainer.style.transition = 'opacity 0.25s ease';

        // Modal Card
        const card = document.createElement('div');
        card.style.width = '90%';
        card.style.maxWidth = '500px';
        card.style.backgroundColor = '#ffffff';
        card.style.borderRadius = '24px';
        card.style.padding = '32px 28px';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        card.style.fontFamily = "'Fredoka', sans-serif";
        card.style.boxSizing = 'border-box';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 28px; color: #3a3a4a; font-weight: 700; letter-spacing: 0.5px;">Request a Custom Level</h2>
                <button id="modal-close-btn" style="background: none; border: none; font-size: 28px; color: #9090a0; cursor: pointer; padding: 0; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">✕</button>
            </div>
            <p style="margin: 0 0 20px 0; font-size: 15px; color: #606070; line-height: 1.4;">
                Have an idea for an awesome puzzle? Describe it below and our team will build it into the game!
            </p>
            <form id="custom-level-form" style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 600; color: #3a3a4a; margin-bottom: 6px;">YOUR NAME</label>
                    <input type="text" id="req-name" placeholder="e.g. Alex" required style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e8; border-radius: 12px; font-size: 16px; font-family: 'Fredoka', sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s;" />
                </div>
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 600; color: #3a3a4a; margin-bottom: 6px;">EMAIL ADDRESS</label>
                    <input type="email" id="req-email" placeholder="e.g. alex@example.com" required style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e8; border-radius: 12px; font-size: 16px; font-family: 'Fredoka', sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s;" />
                </div>
                <div>
                    <label style="display: block; font-size: 14px; font-weight: 600; color: #3a3a4a; margin-bottom: 6px;">LEVEL REQUEST DETAILS</label>
                    <textarea id="req-details" rows="3" placeholder="Describe the layout, lasers, portals, or moving obstacles you'd like..." required style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e8; border-radius: 12px; font-size: 15px; font-family: 'Fredoka', sans-serif; outline: none; box-sizing: border-box; resize: vertical; transition: border-color 0.2s;"></textarea>
                </div>
                <div id="modal-status-msg" style="display: none; font-size: 14px; font-weight: 600; text-align: center; margin-top: 4px;"></div>
                <button type="submit" id="modal-submit-btn" style="margin-top: 8px; width: 100%; padding: 14px; background-color: #6085e0; color: white; border: none; border-radius: 14px; font-size: 18px; font-weight: 700; font-family: 'Fredoka', sans-serif; cursor: pointer; box-shadow: 0 4px 12px rgba(96, 133, 224, 0.3); transition: all 0.2s;">SUBMIT REQUEST</button>
            </form>
        `;

        modalContainer.appendChild(card);
        document.body.appendChild(modalContainer);
        this.domElement = modalContainer;

        // Focus styling
        const inputs = card.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#6085e0';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#e0e0e8';
            });
        });

        // Close button handler
        const closeBtn = card.querySelector('#modal-close-btn');
        closeBtn.addEventListener('click', () => this.destroy());

        // Form submit handler
        const form = card.querySelector('#custom-level-form');
        const statusMsg = card.querySelector('#modal-status-msg');
        const submitBtn = card.querySelector('#modal-submit-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = card.querySelector('#req-name').value;
            const email = card.querySelector('#req-email').value;
            const request = card.querySelector('#req-details').value;

            if (!name || !email || !request) return;

            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerText = 'SUBMITTING...';
            statusMsg.style.display = 'none';

            try {
                await submitLevelRequest({ name, email, request });
                statusMsg.style.display = 'block';
                statusMsg.style.color = '#2e7d32';
                statusMsg.innerText = '✓ Request submitted! Thank you.';
                submitBtn.style.display = 'none';

                setTimeout(() => {
                    this.destroy();
                }, 1800);
            } catch (err) {
                console.error(err);
                statusMsg.style.display = 'block';
                statusMsg.style.color = '#d32f2f';
                statusMsg.innerText = 'Failed to submit request. Please try again.';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerText = 'SUBMIT REQUEST';
            }
        });

        // Trigger animation
        requestAnimationFrame(() => {
            modalContainer.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
    }

    destroy() {
        if (!this.domElement) return;
        this.domElement.style.opacity = '0';
        const card = this.domElement.querySelector('div');
        if (card) card.style.transform = 'scale(0.9)';

        setTimeout(() => {
            if (this.domElement && this.domElement.parentNode) {
                this.domElement.parentNode.removeChild(this.domElement);
            }
            this.domElement = null;
            if (this.onClose) this.onClose();
        }, 250);
    }
}
