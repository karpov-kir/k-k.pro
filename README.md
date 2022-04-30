# Overview

A simple wrapper around personal project that includes:

- HTTPS is provided by Cloudflare automatically
- A K3s cluster and configs
  - Serves projects
  - Serves personal Docker registry
- Docs on how to set up a server

At least the following configuration is required:

- A domain + sub domains
- A DNS hosting with inbuilt HTTPS, e.g. Cloudflare
- An Ubuntu server in a VM hosted in a compute cloud provider
  - A static public IP address
  - 3 GB RAM
  - Simple 2 vCPU with at least 50% proportion of guaranteed performance
  - 20 GB SSD

# Set up

- Update `sudo apt update`
- Disable SSH password authentication
  - `sudo nano /etc/ssh/sshd_config`, make sure that this is set `PasswordAuthentication no`
- Install Docker
  - Follow steps on https://docs.docker.com/engine/install/ubuntu
  - Install Docker Compose `sudo apt install docker-compose`
  - Add the user to the Docker group to allow using it without sudo `sudo usermod -aG docker $USER`
    - Close console and connect again
- Install `kubectl`, follow steps on https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-using-native-package-management
- Configure UFW (Firewall)
  - There are some prebuilt configs in `ls /etc/ufw/applications.d/`, also can be checked with `ufw app list`
  - Enable UFW rules and UFW itself (allow only HTTP (80), HTTPS (443) and SSH (22))
    - `sudo ufw default deny`
    - `sudo ufw allow 80`
    - `sudo ufw allow 443`
    - `sudo ufw allow 'OpenSSH'`
    - `sudo ufw enable`
- Install GIT `sudo apt install git`
  - Clone this repo to a folder `cd ~ && git clone https://github.com/karpov-kir/k-k.io.git`
- Start the K3s cluster
  - `cd ~/k-k.io/k3s && ./k3s-up` (it will generate `kubeconfig.yaml` file)

# Utilities

- [Lens](https://k8slens.dev/) can be used to control the k3s cluster via UI
  - Start Lens
  - On the host start a SSH tunnel `ssh -L 6443:localhost:6443 admin@84.201.142.24`
  - Add a cluster using "Add from kubeconfig", use content of `./k3s/kubeconfig.yaml`
  - Connect to the cluster