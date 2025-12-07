# SAUVEGARDE CONFIGURATION API (n8n)
# Date: 07/12/2025

## URLs & Headers (Authentification)

| Action | Endpoint (n8n URL) | Header Name | Header Value |
|--------|-------------------|-------------|--------------|
| **Loading / Stats** | `.../webhook/reporting` | `reporting` | `reporting.01` |
| **Login Admin** | `.../webhook/mot_de_passe` | `valid` | `correct.01` |
| **Ajouter Produit** | `.../webhook/ajouter_produits` | `ajouter.produit` | `ajouter.produit.01` |
| **Modifier Produit** | `.../webhook/modifier_produits` | `modifier` | `modifier.produit.01` |
| **Supprimer Produit** | `.../webhook/supprimer_produits` | `supprime` | `supprime.produit.01` |
| **Ajouter Info** | `.../webhook/ajouter_infos` | `ajouter.info` | `ajouter.info.01` |
| **Modifier Info** | `.../webhook/modifier_infos` | `modifier.info` | `modifier.info.01` |
| **Supprimer Info** | `.../webhook/supprimer_infos` | `supprime` | `supprime.info.01` |

## Note
Cette configuration est active dans `api/proxy.js`.
Ne pas modifier sans mettre à jour le proxy.
