# Projet n°7 - Créez un réseau social d’entreprise

## Technologies utilisées

- Front
  - VueJS
  - Bootstrap
  - Axios
- Back
  - NodeJS
  - Express
  - MySQL
  - Sequelize

## Installation

### Prérequis

Pour lancer le projet, vous devez avoir les programmes suivants installés sur votre machine :

- NodeJS
- MySQL

### Installation et démarrage de l'API

À la racine du dossier **back**, créez un fichier **.env** avec les éléments suivants :

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=groupomania
DB_USER= (identifiant de connexion à MySQL sur votre machine)
DB_PASSWORD= (mot de passe de connexion à MySQL sur votre machine)

JWT_SECRET= (chaîne de caracatère aléatoires utilisée pour la création de token de session utilisateur)
JWT_DURING=24 hour
```

Dans le dossier **back**, avec le terminal, exécutez la commande suivante pour installer les packages requis pour le fonctionnement du backend :

```
npm install
```

Enfin, exécutez la commande suivante pour démarrer l'API :

```
npm run dev
```

Si tout se passe bien, le message suivant devrait s'afficher dans le terminal :

```
Server is running on port 3000.
```

### Installation de l'application Frontend

Dans le dossier **front**, avec le terminal, exécutez la commande suivante pour installer les packages requis pour le fonctionnement du frontend de l'application :

```
npm install
```

Ensuite, exécutez la commande suivante pour démarrer l'application :

```
npm run serve
```

Par défaut, l'application est accessible en local via le port 8080 à l'adresse http://localhost:8080/
