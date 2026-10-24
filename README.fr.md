![State Class Manager](https://raw.githubusercontent.com/oxyde42/ha-state-class-manager/main/images/icon_128.png)

# State Class Manager

[English](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.md) | [Deutsch](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.de.md) | **Français** | [Español](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.es.md) | [Italiano](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.it.md) | [Nederlands](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.nl.md)

[![Ouvrir votre instance Home Assistant et afficher le dépôt dans HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=oxyde42&repository=ha-state-class-manager&category=integration)

Supprimez la `state_class` de vos capteurs en quelques clics pour que Home Assistant cesse d'enregistrer leurs statistiques dans la base de données. Sans modifier de YAML à la main.

## À quoi ça sert ?

Home Assistant crée des *statistiques* pour chaque capteur ayant une `state_class` (valeurs à court terme toutes les 5 minutes, valeurs à long terme toutes les heures). Les statistiques à long terme ne sont jamais supprimées, la base de données ne cesse donc de grossir. Beaucoup de capteurs (niveau de batterie, force du signal, diagnostics …) n'en ont jamais besoin.

Avec State Class Manager, vous choisissez les capteurs dont vous n'avez pas besoin des statistiques et cochez **Supprimer**. Plus aucune nouvelle statistique n'est enregistrée pour eux. L'historique normal (graphique d'historique, journal) n'est pas modifié.

## Fonctionnalités

- Liste claire de tous les capteurs ayant une `state_class`, avec recherche et filtre
- Une case par capteur, ou « Filtrés : supprimer » pour toute la liste filtrée
- Les changements s'appliquent immédiatement, sans redémarrage
- Se configure tout seul : crée son fichier YAML et l'entrée dans votre `configuration.yaml` (avec sauvegarde)
- Panneau disponible en français, anglais, allemand et espagnol (les autres langues affichent l'anglais)

## Prérequis

- Home Assistant 2024.12 ou plus récent (l'icône et le logo s'affichent à partir de 2026.3)
- [HACS](https://hacs.xyz) installé

## Installation via HACS

1. Cliquez sur le bouton ci-dessus, ou ouvrez HACS → ⋮ → **Dépôts personnalisés**, collez `https://github.com/oxyde42/ha-state-class-manager` et choisissez la catégorie **Intégration**.
2. Recherchez « State Class Manager » dans HACS et cliquez sur **Télécharger**.
3. Redémarrez Home Assistant.
4. Ajoutez l'intégration : cliquez sur le bouton ci-dessous, ou allez dans *Paramètres → Appareils et services → Ajouter une intégration → State Class Manager*.
5. Lisez le texte d'information et cliquez sur **Envoyer**. L'intégration se configure toute seule et affiche le résultat. Cliquez une nouvelle fois sur **Envoyer** pour terminer.

[![Ajouter l'intégration à votre Home Assistant.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=state_class_manager)

**L'intégration ne peut être ajoutée qu'une seule fois.**

### Ce que fait la configuration automatique

- Elle crée le fichier `state_class_manager.yaml` dans votre dossier de configuration.
- Elle ajoute la ligne `state_class_manager: !include state_class_manager.yaml` dans votre `configuration.yaml`, sous `homeassistant:` → `packages:`.
- Auparavant, elle enregistre une copie de sauvegarde (`configuration.yaml.state_class_manager-<date>.bak`). Le fichier est ensuite vérifié et restauré automatiquement en cas de problème. Les commentaires et la mise en forme sont conservés.
- Si votre `configuration.yaml` a une structure qui ne peut pas être modifiée en toute sécurité (par exemple `packages: !include_dir_named packages`), la boîte de dialogue vous le signale. Le panneau affiche alors de courtes instructions manuelles et un bouton « Configurer automatiquement » pour réessayer.

## Utilisation

1. Ouvrez **State Class Manager** dans la barre latérale.
2. Recherchez ou filtrez la liste.
3. Cochez **Supprimer** pour les capteurs sans besoin de statistiques. Pour beaucoup de capteurs à la fois, filtrez la liste et cliquez sur **Filtrés : supprimer**.
4. Cliquez sur **Enregistrer**. C'est fait. Pour annuler, décochez la case et enregistrez à nouveau.

## Bon à savoir

- Seules les statistiques sont concernées. L'historique normal reste inchangé.
- Les statistiques déjà enregistrées restent en place. Supprimez-les dans *Outils de développement → Statistiques* pour libérer de l'espace.
- Ne supprimez pas les capteurs utilisés dans le **tableau de bord Énergie** ou dans les cartes de graphiques statistiques. Ils ont besoin de leur `state_class`.
- Techniquement, le gestionnaire écrit `state_class: none` pour les entités choisies dans le fichier `state_class_manager.yaml` (section `homeassistant: customize_glob:`).

## Est-ce compatible avec mes propres entrées `customize:` ?

Oui. Vos entrées existantes `customize`, `customize_domain` et `customize_glob` dans `configuration.yaml` (ou dans un `customize.yaml` inclus) ne sont **pas modifiées**. Le gestionnaire ajoute seulement son propre petit fichier comme « package », et Home Assistant combine les deux.

- Les capteurs que vous personnalisez vous-même (nom, icône, …) conservent leurs réglages. Le gestionnaire ajoute uniquement `state_class: none` pour les capteurs que vous cochez.
- Si votre propre entrée `customize:` définit elle-même une `state_class` pour un capteur, **votre entrée est prioritaire** et la case « Supprimer » reste sans effet pour ce capteur. Supprimez d'abord cette ligne de votre propre entrée.
- Vous pouvez continuer à utiliser des motifs dans votre propre `customize_glob` (par exemple `sensor.*_battery`). Le gestionnaire n'affiche pas ces motifs, mais il ne les modifie pas.

## L'ouvrir sans entrée dans la barre latérale

Vous utilisez rarement ce panneau ? Allez dans *Paramètres → Appareils et services → State Class Manager → Configurer* et décochez « Afficher l'entrée dans la barre latérale ». Vous pouvez toujours l'ouvrir via

- l'adresse `http://<votre-home-assistant>:8123/state-class-manager` (à enregistrer en favori),
- un bouton sur un tableau de bord avec le chemin de navigation `/state-class-manager`,
- le lien dans la boîte de dialogue de configuration de l'intégration.

## Dépannage

- **« Configuration non terminée » s'affiche dans le panneau :** cliquez sur **Configurer automatiquement**. Si cela ne fonctionne pas, suivez les étapes manuelles affichées.
- **La valeur affiche toujours l'ancienne `state_class` dans Outils de développement → États :** après l'enregistrement, les capteurs sont mis à jour automatiquement. Si la valeur reste, redémarrez Home Assistant une fois. Dans de rares cas, l'intégration qui fournit le capteur redéfinit la valeur ; ouvrez alors un ticket (issue).
- **Aucune icône n'est affichée :** Home Assistant affiche les icônes des intégrations personnalisées à partir de la version 2026.3. Redémarrez et rechargez la page du navigateur (Ctrl+F5).
- **Fichiers de sauvegarde :** vous pouvez supprimer à tout moment les fichiers `.bak` à côté de votre `configuration.yaml`.

## Désinstallation

Les réglages restent actifs tant que `state_class_manager.yaml` est inclus dans votre `configuration.yaml`, même sans l'intégration. Pour rendre leur `state_class` à tous les capteurs, décochez tout et enregistrez **avant** de supprimer l'intégration. Supprimez ensuite l'intégration dans *Paramètres → Appareils et services* et retirez-la dans HACS. Vous pouvez enfin supprimer `state_class_manager.yaml` et son entrée sous `packages:` dans la `configuration.yaml`.
