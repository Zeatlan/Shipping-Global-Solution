# **Changelog** • Shipping Global Solution

Ce document stipulera de toutes les modifications effectuées.

# 1.2.1 02/02/2022

### **Fixs**

- Fix des validations de mission

# 1.2.0 31/01/2022

### **Ajouts**

- Petite icône de chargement quand les données sont en train de charger.
- Ajout d'une redirection quand l'on a fini d'éditer une `entreprise`.
- Il est désormais possible de redimensionner l'image que l'on envoie en guise de photo de profil / bannière (vous pouvez aussi la cadrer comme bon vous semble) cette fonctionnalité est disponible pour tous les cas d'usages (c'est-à-dire ajouter un logo pour une entreprise, un utilisateur, une mission etc...).
  - Note : Cette fonctionnalité ne sera pour l'instant pas disponible pour la création d'entreprise, je dois d'abord refaire le code.

### **Modifications**

- Réajustement de la page d'édition de profil pour être + "propre" (fini les 300 boutons à cliquer sur la page).

### **Fixs**

- Fix du chargement de la page d'édition de profil.
- Fix de la suppression de mission (Les missions restées sur le profil même après la suppression ce qui provoquait des erreurs).
- Fix quand l'on demande à rejoindre une entreprise, on pouvait le faire plusieurs fois (De +, quand nous étions validé dans une entreprise notre requête était
  toujours présente chez les autres).
- Fix du bouton "Requête déjà envoyée" sur les pages d'entreprise qui ne s'affichait pas correctement.

# 1.1.1 26/01/2022

### **Ajouts**

- Ajout d'une liste des participants pour les `missions spéciales`.

### **Modifications**

- Ajout d'une heure à la date de début par défaut pour éviter les erreurs intempestives.

### **Fixs**

- Fix du bouton de déconnexion sur le menu mobile.
- Fix de la page `mission contrat` qui pouvait se casser si le nom d'une remorque ou autre était trop long.
- Fix du `menu mobile` qui pouvait casser.
- Fix des `upload d'images` ( Où pour certains nous pouvions envoyer n'importe quel type d'image ).
- Fix Ajout des `missions spéciales`, les champs ne se dupliquent désormais plus.
- Fix du menu mobile (qui affichait des liens qui n'étaient pas disponibles pour les invités).
- Fix de la page `mission spéciale` les "skeleton" des boutons s'affichaient en boucle quand nous ne sommes pas enregistré ce qui perturbait l'aspect visuel de la page.

### **Suppressions**

- Il n'est désormais plus obligatoire d'ajouter des marchandises pour les missions spéciales.

# 1.1.0 26/01/2022

### **Ajouts**

- Version mobile de l'administration.

### **Fixs**

- Ranking dans la box de l'utilisateur ( qui apparaît au survol d'un lien ).
- Fix de la partie `ressources` => `destinations` (L'édition ne fonctionnait pas bien).
- Fix de la redirection vers la page de son entreprise après la création de celle-ci.
- `Administration` réglage du menu (Désormais il faut cliquer sur un bouton pour tout afficher, ça pouvait être énervant de devoir passer sa souris au dessus en boucle...)

# 1.0.3.1 25/01/2022

#### **Fixs**

- Page de profil cassée ( Wtf ?? ).
- Fix user tooltip ( Agrandissement de la box )

# 1.0.3 • 25/01/2022

### **Ajouts**

- Ajout d'une petite carte qui apparaît au survol d'un lien vers un profil ( en détaillant les infos d'un utilisateur ).
- Ajout d'un lien vers la page de classement depuis notre profil ( La box qui montre notre position dans le classement ).

### **Modifications**

- Refactoring des couleurs pour une meilleure harmonie. ✨
- Mis à jour du créateur de l'entreprise, ce n'est plus un simple pseudo mais bien un utilisateur (avec un avatar, un lien vers le profil affiché sur la page de l'entreprise).

### **Fixs**

- Réglage du menu (sur la partie supérieure de l'administration) qui dépassait légèrement sur la droite de l'écran.
- Fix du créateur de l'entreprise dans la liste des entreprises.
- Fix lien du classement qui menait à l'entreprise.
- Fix du compteur de membre des entreprises (le problème venait que je ne décrémentais pas le nombre de membre quand l'on créait une nouvelle entreprise ...).
- Ajustement des missions spéciales : Nous n'affichons que les remorques qui seront utilisées dans la mission.
- Fix `mission spéciale`, les champs se duppliquaient et donnaient un rendu catastrophique.
- Fix `mission spéciale` (Oui encore), le résumé de la mission retourne désormais à la ligne comme nous l'avions tapé.
- Fix de la page histoire.

# 1.0.2 • 23/01/2022

### **Ajouts**

- Les utilisateurs peuvent désormais savoir leur ancienneté dans leur entreprise. ( Elle est enregistrée dans la base de donnée mais pas sur l'interface, je pense d'abord refaire la structure de la page de profil pour avoir un meilleur rendu visuel )
- Ajout de message quand il n'y a rien à afficher dans la liste des missions (et toutes les autres listes du site).
- Classement fonctionnel sur le `profil`.

### **Modifications**

- Les boutons sur la page de profil / entreprise ne s'affichent pas avant que les autres données soient chargées (De sorte à éviter de cliquer sur un bouton qui n'avait pas pour effet d'être appuyé).
- Redirection vers notre profil quand l'on a fini de modifier.

### **Fixs**

- Ajout du lien sur le bouton "Nous Découvrir" en bas de page.
- Fix de l'inscription ( L'image de profil ne s'affichait pas correctement une fois l'inscription terminée ).
- Fix édition d'utilisateur qui pouvait crash + l'ajout d'une redirection vers la liste des utilisateurs une fois l'édition terminée.
- Fix du profil ( Le bouton de modification de profil pouvait ne pas apparaître ).
- Fix des notifications, il n'y avait rien d'encombrant ou de gênant pour les utilisateurs mais l'erreur dans la console me perturbait.
- Nous ne pouvons plus rejoindre une entreprise si nous sommes propriétaire d'une autre ( ça évitera les entreprises à l'abandon ).
- Fix des cookies, si vous êtes sur la `v1.0.2` et que vous rencontrez des erreurs comme des pages qui affichent une erreur, supprimez vos cookies. (Vous n'aurez besoin de le faire qu'une seule fois, si le problème persiste alors il provient sûrement d'autres choses).

### **Suppressions**

- Fusion `mission farming` => `mission contrat` car les deux avaient les mêmes fonctionnalités.
- Suppression de la dupplication des preview dans la création d'entreprise.

## 1.0.1 • 23/01/2022

### **Ajouts**

### **Modifications**

- Les liens vers les profils sont désormais des ID pour éviter les complications ( `/user/Hk4XQle1bygpV3pSFeiCIhnMbA73` au lieu de `/user/Zeatlan` par exemple).
- Animation quand l'on approuve / désapprouve un membre pour son entreprise.

### **Fixs**

- L'image de profil se met à jour dans le menu quand nous la modifions.
- Fix du bouton "Mission terminée" qui ne s'affichait pas.
- Fix approbation - liste des membres dans la gestion de l'entreprise.

## v1.0.0 • 21/01/2022

### **Ajouts**

- Ajout de la capacité à **Approuver / Désapprouver une entreprise** (petit oubli de ma part).
- Ajout de la **liste des missions contrats**. [+ Ajout, Édition, Suppression]
- Ajout d'un type de notification (il y avait à la base la notification "succès" / "erreur" / "serveur" j'ai ajouté la notification "info" pour les informations lambda que le site voudrait transmettre).
- Ajout de la **liste des missions spéciales**. [+ Ajout, Édition, Suppression]
- Ajout de la page `ressources` qui répertorie toutes les données détaillées dans la base de données.
- Ajout de la `liste des ressources` (**Entreprises destinataires**). [+ Ajout, Édition, Suppression]
- Ajout de la `liste des ressources` (**Entreprises locales**). [+ Ajout, Édition, Suppression]
- Ajout de la `liste des ressources` (**Items**). [+ Ajout, Édition, Suppression]
- Ajout des `permissions`.
  - Les utilisateurs / visiteurs n'ont en aucun cas accès à l'administration.
  - Liste des utilisateurs, nous ne pouvons modifier un membre qui est seulement en-dessous de notre rank. (Un modérateur ne peut pas modifier un autre modérateur).
  - Les modérateurs n'ont pas accès à l'administration des missions - Ressources.
  - Les utilisateurs non validés ne peuvent pas modifier leur profil / Rejoindre ou Créer une entreprise / Participer à une mission.
- Ajout de l'affichage des missions sur le profil.
- Ajout de l'affichage du nombre de missions accomplies sur le profil des partenaires.
- Ajout de la possibilité de **soumettre une mission spéciale ou une mission contrat**.
- Ajout de la page `approbation` pour l'approbation des missions que fournissent les utilisateurs.
- Implémentation de la pagination pour les `missions`.
- Ajout des skeleton pour les pages `missions speciales`, `missions contrats` et `classement`.
- Refonte d'une grosse partie du css.

### **Modifications**

- Modification de l'URL pour les missions, j'utilise désormais le nom de la mission au lieu de son id (Les missions ne pourront par conséquent par avoir le même nom).
- Refactorisation du code des notifications (et tout remettre en place m'a pris un temps fou.).
- Les marchandises présentées dans les missions spéciales sont désormais des `objets` au lieu de `chaîne de caractère`, l'objectif ? A l'avenir pouvoir mettre un prix sur les items ou pouvoir ajouter d'autres informations sur ceux-ci. (Les items sont donc stockés dans la base de donnée).
- Modification de la page `profil`
  - Précision de site un utilisateur est validé ou non
- Possibilité de trier le `classement` en fonction des `missions contrats` ou des `missions spéciales`.

### **Fixs**

- Fix `listing des missions` ( Les missions n'avaient pas d'espace entre elles ).
- Fix `mission contrat`, les remorques - cargaisons - trucky dépassaient des cadres si le texte était trop long.
- Fix de certains champs où l'on pouvait mettre d'autres fichiers que des "jpg" / "png".
- Fix `page mission spéciale` (Dû aux quelques changements dans la base de données).
- Fix boutons des missions contrats qui partaient n'importe comment.
- Fix inscription mission contrat.
- Fix du bouton d'inscription des missions.
- Fix des noms qui se cassaient dans le tableau de bord de l'administration.
- Fix de la page `équipe` qui n'affichait pas les bons noms pour certains rôles.
- Fix liste des participants ( `mission contrat` ) qui pouvaient se dupliquer.

## v0.9.0 • 09/01/2022

### **Ajouts**

- Ajout de divers liens dans le `footer`.
- Ajout de la box qui affichent les participants à la mission spéciale.
- Ajout d'une page d'erreur.
- Ajout d'une animation sur les petites box dans l'index.
- Ajout du tableau de bord.
- Ajout du menu de navigation de l'administration.
- Ajout de la liste d'utilisateur dans l'administration.
  - Liste des utilisateurs.
  - Suppression d'un utilisateur.
  - Modification des informations d'un utilisateur.
- Ajout de la liste des partenaires dans l'administration.
  - Liste des partenaires
  - Suppression d'un partenaire.
  - Modification des informations d'un partenaire.

### **Modifications**

- Modification de l'édition de profil, le changement de nom d'utilisateur ne se fait que visuellement il y a donc un rappel du nom d'utilisateur à inscrire pour se connecter à son compte.
- La liste des participants affiche désormais l'acronyme de l'entreprise.
- Nous pouvons participer à une mission spéciale / contrat.
- Les missions se finissent automatiquement quand le nombre maximum de completion a été atteint.
- Modification du menu, certains éléments disparaissent quand nous ne sommes pas connecté ( Classement, Devenir Partenaire ).

### **Fixs**

- Fix du `footer` dans la page `leaderboard`. (Il ne se rafraichissait pas et donc ne se mettez pas à l'endroit voulu)
- Fix de la déconnexion (Une erreur pouvait parfois apparaître quand on voulait se déconnecter).
- Fix de la page de profil sur le kilométrage.
- Fix du `Header` ( Utilisation d'un `v-show` au lieu d'un `v-if` (car meilleur en terme de performance)).
- Fix cookies du Login, nous avons désormais le rank de l'utilisateur en cookies.
- Fix du store qui se réinitialisait et nous déconnectez en boucle.
- Fix icone des notifications (elles ont bel et bien un fond bien circulaire désormais), le "X" pour fermer la notification est beaucoup plus gros.
- Fix notifications qui ne se supprimaient pas de la mémoire.
