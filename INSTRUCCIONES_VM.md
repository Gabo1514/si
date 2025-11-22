# Instrucciones para Desplegar en VM Ubuntu

## 1. Preparar la VM

### Instalar Docker y Docker Compose
```bash
# Actualizar el sistema
sudo apt update
sudo apt upgrade -y

# Instalar Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Instalar Docker Compose
sudo apt install docker-compose -y

# Agregar usuario al grupo docker (opcional)
sudo usermod -aG docker $USER
```

## 2. Subir el Proyecto a la VM

### Opción A: Usando Git
```bash
# En tu máquina local, sube el proyecto a GitHub
git init
git add .
git commit -m "Sistema de facturación completo"
git remote add origin https://github.com/tu-usuario/sistema-facturacion.git
git push -u origin main

# En la VM, clona el repositorio
git clone https://github.com/tu-usuario/sistema-facturacion.git
cd sistema-facturacion
```

### Opción B: Usando SCP (desde tu máquina local)
```bash
# Comprimir el proyecto
tar -czf sistema-facturacion.tar.gz .

# Subir a la VM
scp sistema-facturacion.tar.gz usuario@IP_VM:/home/usuario/

# En la VM, descomprimir
ssh usuario@IP_VM
cd /home/usuario
tar -xzf sistema-facturacion.tar.gz
cd sistema-facturacion
```

## 3. Construir y Levantar los Contenedores

```bash
# Construir las imágenes
sudo docker-compose build

# Levantar los servicios
sudo docker-compose up -d

# Verificar que estén corriendo
sudo docker-compose ps

# Ver logs si hay problemas
sudo docker-compose logs -f
```

## 4. Acceder al Sistema

### Desde la VM
```
http://localhost
```

### Desde tu navegador (usando la IP de la VM)
```
http://IP_DE_TU_VM
```

Ejemplo: `http://192.168.1.100`

## 5. Comandos Útiles

### Ver logs
```bash
sudo docker-compose logs -f backend
sudo docker-compose logs -f frontend
```

### Reiniciar servicios
```bash
sudo docker-compose restart
```

### Detener servicios
```bash
sudo docker-compose down
```

### Actualizar el proyecto
```bash
# Detener servicios
sudo docker-compose down

# Actualizar código (si usas Git)
git pull

# Reconstruir y levantar
sudo docker-compose up -d --build
```

## 6. Configurar Firewall (Opcional)

```bash
# Permitir tráfico en puerto 80
sudo ufw allow 80/tcp

# Permitir tráfico en puerto 3000 (si quieres acceso directo al backend)
sudo ufw allow 3000/tcp

# Habilitar firewall
sudo ufw enable
```

## 7. Verificación

### Verificar que el backend responde
```bash
curl http://localhost:3000/api/health
```

### Verificar que el frontend responde
```bash
curl http://localhost
```

## Notas Importantes

- El sistema estará disponible en el puerto 80 (HTTP)
- No necesitas dominio, puedes acceder por IP
- El backend corre en el puerto 3000
- Los contenedores se reinician automáticamente si se caen
- Los datos de las facturas se pierden al reiniciar (no hay base de datos persistente)

## Solución de Problemas

### Si el puerto 80 está ocupado
```bash
# Ver qué está usando el puerto 80
sudo lsof -i :80

# Detener el servicio que lo usa (ejemplo: Apache)
sudo systemctl stop apache2
```

### Si Docker no tiene permisos
```bash
sudo chmod 666 /var/run/docker.sock
```

### Si hay problemas de red entre contenedores
```bash
sudo docker network ls
sudo docker network inspect facturacion-network
```
