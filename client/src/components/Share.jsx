import { useState } from "react";
import "../styles/Share.css";

const Share = ({ isOpen, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-overlay">
      <div className="share-content">
        <div className="share-header">
          <h3>Share View</h3>
          <button
            onClick={() => onClose(false)}
            className="close-button"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="url-container">
          <input
            type="text"
            value={window.location.href}
            readOnly
            className="url-input"
            aria-label="Share URL"
          />
          <button
            onClick={handleCopyLink}
            className={`copy-button ${copySuccess ? "success" : ""}`}
          >
            {copySuccess ? "Copied!" : "Copy Link"}
          </button>
        </div>
        <p className="share-note">
          Anyone with this link will be able to view your current filter
          settings.
        </p>
      </div>
    </div>
  );
};

export default Share;
