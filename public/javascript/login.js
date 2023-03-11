async function loginFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    
    if (username && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          username,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        console.log("logged in");
        alert("logged in!!!")
        document.location.replace('/');
      } else {
        alert(response.statusText);  
      }
    }
    else
    {
      alert("Please enter both username and password");
    }
  };
  
  document.querySelector('#login-btn').addEventListener('click', loginFormHandler);