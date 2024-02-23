import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./popup.css";

const Popup = () => {
  const [snippet, setSnippet] = useState("");
  const [snippetList, setSnippetList] = useState([]);
  const [copyText, setCopyText] = useState([]);

  useEffect(() => {
    const storedSnippetList = JSON.parse(localStorage.getItem("snippetList"));
    if (storedSnippetList) {
      setSnippetList(storedSnippetList);
    }
    // Initialize copyText state with 'copy' for each item
    setCopyText(Array(storedSnippetList.length).fill('copy'));
  }, []);

  const resetAllCopyText = () => {
    // Reset all buttons to 'copy'
    setCopyText(prevCopyText => prevCopyText.map(() => 'copy'));
  };

  const handleSetText = (index) => {
    // Create a new array to avoid mutating state directly
    setCopyText(prevCopyText => prevCopyText.map((text, i) => (i === index ? 'copied' : text)));
  }

  const saveSnippetToStorage = (newSnippetList) => {
    localStorage.setItem("snippetList", JSON.stringify(newSnippetList));
  };

  const handleSaveSnippet = () => {
    const snippetString = String(snippet);
    const newSnippetList = [...snippetList, snippetString];
    setSnippetList(newSnippetList);
    setSnippet("");
    // Initialize copyText state with 'copy' for each new item
    setCopyText(prevCopyText => [...prevCopyText, 'copy']);
    saveSnippetToStorage(newSnippetList);
  };

  const handleCopyToClipboard = (content, index) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("Snippet copied to clipboard!");
        resetAllCopyText();
        handleSetText(index);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  const handleDeleteSnippet = (item) => {
    const newSnippetList = snippetList.filter((s) => s !== item);
    setSnippetList(newSnippetList);
    // Initialize copyText state with 'copy' for each remaining item after deletion
    setCopyText(prevCopyText => Array(newSnippetList.length).fill('copy'));
    saveSnippetToStorage(newSnippetList);
  };

  return (
    <div className="snippet-container" style={{ overflow: "auto", width: "300px" }}>
      <textarea
        className="snippet-input"
        placeholder="Paste snippet here..."
        value={snippet}
        onChange={(e) => setSnippet(e.target.value)}
      />
      <button className="save-button" onClick={handleSaveSnippet}>
        Save
      </button>
      <ul className="snippet-list">
        {snippetList.map((item, index) => (
          <li key={index} className="snippet">
            {typeof item === "string" ? (
              <>
                <pre>
                  <code>{item}</code>
                </pre>
                <span>
                  <button
                    className="copy-button"
                    onClick={() => handleCopyToClipboard(item, index)}
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                  >
                    {copyText[index]}
                  </button>
                </span>
                <span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteSnippet(item)}
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </span>
              </>
            ) : (
              <span>{item}</span>
            )}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("react-target"));
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);