// src/pages/Auth/Register.jsx
import React from 'react';

const Register = () => {
  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: '#f5f5f5', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      margin: '50px auto',
      maxWidth: '500px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Register Account</h1>
      <p style={{ textAlign: 'center' }}>Create a new account to track your games.</p>
      
      <form style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username:
          </label>
          <input 
            type="text" 
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input 
            type="email" 
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input 
            type="password" 
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }} 
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#2a75bb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Register
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <a href="/login" style={{ color: '#2a75bb' }}>Login</a>
      </div>
    </div>
  );
};

export default Register;