import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import FileSaver from 'file-saver';
import ClipboardJS from 'clipboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function PasswordManager() {
  const [passwords, setPasswords] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [importData, setImportData] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secretkey').toString();
    setPasswords([...passwords, { name, password: encryptedPassword }]);
    setName('');
    setPassword('');
  };

  const handleDelete = (index) => {
    const newPasswords = [...passwords];
    newPasswords.splice(index, 1);
    setPasswords(newPasswords);
  };

  const handleExport = () => {
    const data = JSON.stringify(passwords);
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, 'passwords.txt');
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      setPasswords(data);
      setImportData('');
    } catch (error) {
      alert('Invalid data format');
    }
  };

  const handleClipboardCopy = (text) => {
    const clipboard = new ClipboardJS('.clipboard-btn', {
      text: function() {
        return text;
      }
    });
    clipboard.on('success', function() {
      alert('Copied to clipboard');
      clipboard.destroy();
    });
    clipboard.on('error', function() {
      alert('Failed to copy to clipboard');
      clipboard.destroy();
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderPasswordList = () => {
    const filteredPasswords = passwords.filter((password) => {
      return password.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPasswords.map((password, index) => (
            <tr key={index}>
              <td>{password.name}</td>
              <td>{CryptoJS.AES.decrypt(password.password, 'secretkey').toString(CryptoJS.enc.Utf8)}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
                <button className="btn btn-primary clipboard-btn" onClick={() => handleClipboardCopy(CryptoJS.AES.decrypt(password.password, 'secretkey').toString(CryptoJS.enc.Utf8))}>Copy to Clipboard</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <h2>Password Manager</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type=          "password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Add Password</button>
      </form>
      <hr />
      <div className="form-group">
        <label htmlFor="search">Search:</label>
        <input type="text" className="form-control" id="search" value={searchTerm} onChange={handleSearch} />
      </div>
      {renderPasswordList()}
      <hr />
      <div className="form-group">
        <label htmlFor="import">Import:</label>
        <textarea className="form-control" id="import" rows="3" value={importData} onChange={(e) => setImportData(e.target.value)}></textarea>
        <button type="button" className="btn btn-primary" onClick={handleImport}>Import</button>
      </div>
      <hr />
      <button type="button" className="btn btn-primary" onClick={handleExport}>Export</button>
    </div>
  );
}

export default PasswordManager;

