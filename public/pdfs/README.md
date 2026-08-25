# Portfolio de rapports techniques — HONORINE Kylian

BUT Réseaux & Télécommunications — Filière Cybersécurité
IUT de La Réunion · 2024–2026

Ce portfolio rassemble **huit rapports techniques** retravaillés à partir de mes
livrables académiques. Chaque rapport est entièrement reformaté en LaTeX, avec
sa propre identité visuelle, son logo TikZ dédié et un soin particulier porté
à la concision : pas de remplissage, juste les éléments qu'un recruteur, un
encadrant ou un futur collègue voudrait lire.

## Sommaire des rapports

| Rapport | Pages | Domaine | Stack technique |
|---|---|---|---|
| `ctf.pdf` | 5 | **Pentest** | WordPress · GRUB · vsftpd · LFI/SUID · Tomcat — 4 root sur 5 |
| `fibre-optique.pdf` | 5 | **Télécoms** | FTTx · GPON · bilan de liaison · ARCEP |
| `grafana-loki.pdf` | 6 | **Observabilité** | Grafana · Prometheus · cAdvisor · PostgreSQL (base TAAF) |
| `harmely.pdf` | 6 | **Dev mobile** | React Native · Expo · Firebase · API Spotify |
| `iot.pdf` | 6 | **IoT** | Pycom FiPy · MicroPython · MQTT · Mosquitto · Grafana |
| `stormshield-nat.pdf` | 6 | **Sécurité réseau** | Stormshield · VLANs · NAT statique/masquage · filtrage |
| `sae-cyber-gns3.pdf` | 10 | **Réseau d'entreprise** | GNS3 · HSRP · PVST+ · ACL · MPLS VPN MP-BGP |
| `rt-bank-multisite.pdf` | 9 | **Infra cyber** | Stormshield · HAProxy · BIND9 · Active Directory · Zabbix |

## Structure des fichiers

Chaque rapport est livré sous deux formats :
- `*.pdf` — version finale prête à lire / imprimer
- `*.tex` — source LaTeX réutilisable (palette, logo TikZ, structure)

## Outils utilisés

Compilation testée sur TeX Live 2023 / pdfLaTeX. Packages clés :
`fontawesome5`, `tikz`, `tcolorbox`, `listings`, `babel/french`, `lmodern`,
`fancyhdr`, `hyperref`. Deux passes pdflatex nécessaires pour les logos en
overlay sur la page de titre.

## Contact

**HONORINE Kylian** — étudiant BUT3 R&T parcours Cybersécurité
IUT de La Réunion
