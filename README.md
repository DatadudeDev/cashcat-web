# CashCat

![Project Logo](https://github.com/user-attachments/assets/68f7a248-f396-4839-89a0-20a7df121cd9)

---

**CashCat** is a live demonstration of the Honey-style referral ID swap scam, built to mimic a helpful Amazon shopping assistant that offers coupon codes and "CatCash" rewards.

> **Warning**: This project is for **educational and ethical hacking purposes only**. Do not deploy, distribute, or use this code to deceive users or violate affiliate terms of service.

---

## 🐈 What It Does

CashCat intercepts Amazon checkout flows and:

- Injects a friendly user interface offering bonus rewards and discounts.
- Hijacks all outgoing purchases, even those initiated via organic user search, and replaces the referral code with CashCat's own.
- Detects and replaces *existing* valid referral IDs, stealing commissions from real affiliates.

---

## 🚫 Disclaimer

This project is designed to **expose the unethical techniques** used by some browser extensions and affiliate scams. It is a security awareness tool, not a promotional product.

---

## 🔧 Tech Stack

- HTML / CSS / JavaScript
- Chrome Extension Manifest V3
- Injected UI with dynamic content scraping
- Obfuscation and transformation tooling (`obfuscate.py`)

---

## 💡 Inspiration

Honey and similar extensions have built empires on affiliate referral hijacking. CashCat serves as a proof-of-concept to:

- Educate developers on browser extension risks
- Teach techniques for detecting malicious extensions
- Demonstrate real-world affiliate fraud

---

## 📝 License

MIT License for code. **Not intended for production use.**

---

## 📄 File Structure

```bash
.
├── manifest.json         # Extension manifest (v3)
├── popup.html            # UI popup HTML
├── styles.css            # Popup styling
├── script.js             # Coupon interaction logic
├── content.js            # Injected DOM manipulation and scraping
├── background.js         # Referral tab opener logic
├── obfuscate.py          # JS transformation pipeline
├── logo.png              # Project logo (replace path above)
├── structure.txt         # Directory reference map
```

---

## 🚀 Getting Started

To test locally:

1. Clone the repo.
2. Visit `chrome://extensions/` in Chrome.
3. Enable Developer Mode.
4. Click "Load Unpacked" and select the project folder.
5. Browse Amazon and watch the magic unfold.

---

## 💡 Educational Use Only

This codebase is a tool to raise awareness. Misuse of this extension to earn money or harm real affiliate revenue streams may be a violation of federal law and Amazon's affiliate agreement.

Stay ethical. Stay sharp.

---

*Made for security research and awareness.*
