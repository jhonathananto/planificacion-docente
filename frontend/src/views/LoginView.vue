<template>
    <div class="login-container">
      <Card style="max-width: 400px; margin: 0 auto;">
        <template #header>
          <h2 class="text-center">Iniciar Sesión</h2>
        </template>
        <template #content>
          <form @submit.prevent="handleLogin">
            <div class="p-field">
              <label for="username" class="block">Usuario</label>
              <InputText
                id="username"
                v-model="username"
                placeholder="Ingrese su usuario"
                class="w-full"
                :class="{ 'p-invalid': error && !username }"
              />
            </div>
            <div class="p-field mt-3">
              <label for="password" class="block">Contraseña</label>
              <Password
                id="password"
                v-model="password"
                placeholder="Ingrese su contraseña"
                class="w-full"
                :feedback="false"
                :class="{ 'p-invalid': error && !password }"
              />
            </div>
            <Button
              type="submit"
              label="Iniciar Sesión"
              class="w-full mt-3"
              :loading="loading"
            />
            <Message v-if="error" severity="error" class="mt-3">{{ error }}</Message>
          </form>
        </template>
      </Card>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Card from 'primevue/card';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  import Message from 'primevue/message';
  
  export default {
    name: 'LoginView',
    components: {
      Card,
      InputText,
      Password,
      Button,
      Message,
    },
    setup() {
      const username = ref('');
      const password = ref('');
      const error = ref('');
      const loading = ref(false);
      const router = useRouter();
  
      const handleLogin = async () => {
        if (!username.value || !password.value) {
          error.value = 'Por favor, completa todos los campos';
          return;
        }
  
        loading.value = true;
        error.value = '';
  
        try {
          const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: username.value,
              password: password.value,
            }),
          });
          const data = await response.json();
  
          if (data.success) {
            // Redirigir al dashboard si el login es exitoso
            router.push('/dashboard');
          } else {
            error.value = data.message || 'Credenciales inválidas';
          }
        } catch (err) {
          error.value = 'Error al conectar con el servidor';
        } finally {
          loading.value = false;
        }
      };
  
      return {
        username,
        password,
        error,
        loading,
        handleLogin,
      };
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
  }
  
  .p-field label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .text-center {
    text-align: center;
  }
  </style>