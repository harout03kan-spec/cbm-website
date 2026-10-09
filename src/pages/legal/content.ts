// Legal / policy pages content (EN + FR). Plain language, matched to how
// Canada BTC Miners sells: final sale, used-unit 30-day warranty, manufacturer
// warranty on new units, 7-day DOA on large lots, 2–12 business day shipping
// after full payment, shipping included on new units.
//
// Edit the text here; the page layout is in ./page.tsx.

export type LegalDocKey = 'privacy' | 'terms' | 'shipping' | 'warranty';

export interface LegalSection {
  h: string;
  p?: string[];
  list?: string[];
}

export interface LegalDoc {
  title: string;
  seoDescription: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_UPDATED = '2026-10-09';

const CONTACT_EN = 'Canada BTC Miners, 4040 Rue Steinberg, Saint-Laurent, QC H4R 2G7 · info@canadabtcminers.ca · +1 (514) 604-7050';
const CONTACT_FR = 'Canada BTC Miners, 4040 Rue Steinberg, Saint-Laurent (QC) H4R 2G7 · info@canadabtcminers.ca · +1 (514) 604-7050';

const LEGAL_RIGHTS_EN =
  'Nothing in this policy limits rights you have under consumer protection laws that cannot be waived, including the Quebec Consumer Protection Act.';
const LEGAL_RIGHTS_FR =
  'Rien dans cette politique ne limite les droits que vous accordent les lois sur la protection du consommateur auxquels on ne peut renoncer, y compris la Loi sur la protection du consommateur du Québec.';

export const LEGAL: Record<'en' | 'fr', Record<LegalDocKey, LegalDoc>> = {
  en: {
    privacy: {
      title: 'Privacy Policy',
      seoDescription: 'How Canada BTC Miners collects, uses and protects personal information, and your privacy rights under Quebec and Canadian law.',
      intro:
        'Canada BTC Miners sells, repairs and hosts ASIC mining equipment from Saint-Laurent, Quebec. This policy explains what personal information we collect, why we collect it, who we share it with, and your rights under Quebec’s Act respecting the protection of personal information in the private sector (Law 25) and Canada’s PIPEDA.',
      sections: [
        {
          h: 'Person in charge of personal information',
          p: [`The person in charge of the protection of personal information is the owner of Canada BTC Miners. Contact: ${CONTACT_EN}.`],
        },
        {
          h: 'What we collect',
          list: [
            'Contact details you give us: name, email, phone, company and your message (contact, hosting quote and promo forms).',
            'Order details: billing and shipping address, phone, items ordered and order history.',
            'Repair and hosting details: equipment models, serial numbers, logs and photos you send us.',
            'Messages and calls with our team.',
            'We do not store full card numbers. Card payments are processed by Moneris.',
          ],
        },
        {
          h: 'Why we use it',
          list: [
            'To answer your questions and prepare quotes.',
            'To process, ship and support your orders, repairs, warranty and hosting.',
            'To send order, shipping and repair updates.',
            'To send offers, only if you agreed. You can unsubscribe at any time.',
            'To meet accounting, tax and legal obligations, and to prevent fraud.',
          ],
        },
        {
          h: 'Who we share it with',
          p: ['We share only what is needed with service providers that help us run the business. We do not sell personal information.'],
          list: [
            'Lightspeed (Ecwid): online store, cart and orders.',
            'Moneris: card payments.',
            'Netlify: website hosting and website forms.',
            'Shipping carriers: delivery of your order.',
            'Our accountant and government authorities, when the law requires it.',
          ],
        },
        {
          h: 'Information stored outside Quebec',
          p: ['Some of these providers store information outside Quebec or Canada, for example in the United States. We use providers that protect information in line with generally accepted principles.'],
        },
        {
          h: 'Cookies',
          p: ['The store uses cookies needed for the cart, checkout and account. With your consent, it may also use cookies to measure how the site performs. You can choose in the cookie notice, or block cookies in your browser, but the cart may not work without them.'],
        },
        {
          h: 'How long we keep it',
          p: ['We keep personal information only as long as needed for the purpose it was collected, and as long as tax and accounting laws require for transaction records. Then we destroy or anonymize it.'],
        },
        {
          h: 'Security',
          p: ['We use reasonable safeguards and limit access to people who need it. Card data is handled by Moneris, not stored by us.'],
        },
        {
          h: 'Your rights',
          list: [
            'Ask to see the personal information we hold about you.',
            'Ask us to correct it.',
            'Withdraw your consent, for example to marketing emails.',
            'Ask us to stop sharing it, or to receive it in a common format.',
          ],
          p: [
            'Send your request to info@canadabtcminers.ca. We reply within 30 days.',
            'If you are not satisfied, you can contact the Commission d’accès à l’information du Québec or the Office of the Privacy Commissioner of Canada.',
          ],
        },
        {
          h: 'Changes',
          p: ['We may update this policy. The current version is always on this page with its date.'],
        },
      ],
    },
    terms: {
      title: 'Terms of Sale',
      seoDescription: 'Terms of sale for ASIC miners, parts and accessories bought from Canada BTC Miners: prices, payment, final sale, warranty and liability.',
      intro: 'These terms apply to every purchase from Canada BTC Miners, online, by phone or by invoice. By placing an order, you agree to them.',
      sections: [
        {
          h: 'Prices and taxes',
          list: [
            'Prices are in Canadian dollars unless stated otherwise.',
            'Prices and availability can change until your order is confirmed. If a price is clearly wrong, we may cancel the order and refund any payment in full.',
            'Taxes (GST, QST, HST, etc.) are added based on your shipping address.',
          ],
        },
        {
          h: 'Orders and payment',
          list: [
            'Your order is confirmed once full payment is received.',
            'Online: credit or debit card, processed by Moneris.',
            'Interac e-Transfer, wire transfer, crypto or cash: contact us and we will send you an invoice.',
            'Large lots, bulk orders and quotes: the terms written on your quote or invoice apply where they differ from these terms.',
          ],
        },
        {
          h: 'Shipping',
          p: ['Orders ship 2 to 12 business days after full payment is received, depending on availability and the model. See our Shipping & Returns policy for details.'],
        },
        {
          h: 'All sales are final',
          p: ['We do not offer refunds, returns or exchanges. This includes change of mind, ordering the wrong model, and changes in mining difficulty, coin prices or profitability. Defective units are handled under our Warranty policy.'],
        },
        {
          h: 'Warranty',
          p: ['Brand-new units carry the manufacturer’s warranty. Used and refurbished units have a 30-day warranty from our repair center. Large lots have a 7-day DOA period unless your invoice says otherwise. See our Warranty policy.'],
        },
        {
          h: 'Using your equipment',
          list: [
            'ASIC miners are high-power industrial equipment. You are responsible for proper electrical installation, cooling and ventilation, and for following local rules.',
            'Mining results depend on network difficulty, coin prices and electricity costs. We do not guarantee any mining income or profit.',
          ],
        },
        {
          h: 'Limitation of liability',
          p: ['To the extent the law allows, our total liability for any order is limited to the price paid for the product. We are not responsible for lost profits, lost mining revenue, electricity costs or other indirect losses.'],
        },
        {
          h: 'Payment disputes',
          p: ['If there is a problem with your order, please contact us first. We will work with you to resolve it.'],
        },
        {
          h: 'Your legal rights',
          p: [LEGAL_RIGHTS_EN],
        },
        {
          h: 'Governing law',
          p: ['These terms are governed by the laws of Quebec and the federal laws of Canada that apply there.'],
        },
        {
          h: 'Contact',
          p: [CONTACT_EN],
        },
      ],
    },
    shipping: {
      title: 'Shipping & Returns',
      seoDescription: 'Shipping times, costs and tracking for ASIC miners from Canada BTC Miners, and our final sale return policy.',
      intro: 'How and when your order ships, what shipping costs, and our return policy.',
      sections: [
        {
          h: 'Shipping time',
          p: ['Orders ship 2 to 12 business days after full payment is received, depending on availability and the model.'],
        },
        {
          h: 'Shipping cost',
          list: [
            'Brand-new units: shipping is included.',
            'Used and refurbished units, parts and accessories: the shipping cost is shown at checkout or on your invoice.',
          ],
        },
        {
          h: 'Tracking',
          p: ['We email you a tracking number when your order ships.'],
        },
        {
          h: 'When your order arrives',
          p: ['Check the boxes when they arrive. If you see shipping damage, note it with the carrier, take photos, and contact us right away, within your warranty or DOA period.'],
        },
        {
          h: 'Returns, refunds and exchanges',
          p: [
            'All sales are final. We do not accept returns, refunds or exchanges, including for change of mind or ordering the wrong model.',
            'Once payment is received, orders cannot be cancelled. If we cannot fulfill your order, we refund the full amount.',
            'Defective units are handled under our Warranty policy.',
          ],
        },
        {
          h: 'Your legal rights',
          p: [LEGAL_RIGHTS_EN],
        },
        {
          h: 'Questions',
          p: [CONTACT_EN],
        },
      ],
    },
    warranty: {
      title: 'Warranty',
      seoDescription: 'Warranty on ASIC miners from Canada BTC Miners: manufacturer warranty on new units, 30-day warranty on used units and repairs, 7-day DOA on large lots.',
      intro: 'What is covered on the equipment you buy or repair with us, and how to make a claim.',
      sections: [
        {
          h: 'Brand-new units',
          p: ['Brand-new units come with the original manufacturer’s warranty (for example Bitmain or MicroBT). The manufacturer sets the terms and handles the claim. We can help you with the process.'],
        },
        {
          h: 'Used and refurbished units',
          p: ['Used and refurbished units have a 30-day warranty from our repair center in Montreal, starting on the delivery or pickup date. If the unit fails under normal use during that time, we repair it at our repair center. This warranty is a repair, not a refund.'],
        },
        {
          h: 'Repairs',
          p: ['Repair work has a 30-day warranty on the repaired issue, unless stated otherwise on your repair invoice.'],
        },
        {
          h: 'Large lots: 7-day DOA',
          p: ['Large lots and bulk orders have a 7-day DOA (dead on arrival) period from the delivery date, unless different terms are written on your quote or invoice. Report DOA units within 7 days with the serial numbers, photos and miner logs.'],
        },
        {
          h: 'What is not covered',
          list: [
            'Physical damage, drops, or liquid damage.',
            'Damage from wrong voltage, power surges or poor electrical installation.',
            'Overheating from poor ventilation, or heavy dust buildup.',
            'Units opened, repaired or modified by someone else, or with removed warranty seals.',
            'Custom firmware or overclocking.',
            'Shipping damage that was not reported on arrival.',
          ],
        },
        {
          h: 'How to make a claim',
          p: ['Contact us with your order or invoice number, the unit’s serial number, a short description of the problem, and the miner logs if possible. We will tell you the next steps.'],
        },
        {
          h: 'Your legal rights',
          p: [LEGAL_RIGHTS_EN],
        },
        {
          h: 'Contact',
          p: [CONTACT_EN],
        },
      ],
    },
  },

  fr: {
    privacy: {
      title: 'Politique de confidentialité',
      seoDescription: 'Comment Canada BTC Miners recueille, utilise et protège les renseignements personnels, et vos droits selon les lois du Québec et du Canada.',
      intro:
        'Canada BTC Miners vend, répare et héberge de l’équipement de minage ASIC à Saint-Laurent, au Québec. Cette politique explique quels renseignements personnels nous recueillons, pourquoi, avec qui nous les partageons et vos droits selon la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25) et la LPRPDE du Canada.',
      sections: [
        {
          h: 'Responsable de la protection des renseignements personnels',
          p: [`La personne responsable de la protection des renseignements personnels est le propriétaire de Canada BTC Miners. Coordonnées : ${CONTACT_FR}.`],
        },
        {
          h: 'Ce que nous recueillons',
          list: [
            'Les coordonnées que vous nous donnez : nom, courriel, téléphone, entreprise et votre message (formulaires de contact, de soumission d’hébergement et de code promo).',
            'Les détails de commande : adresse de facturation et de livraison, téléphone, articles commandés et historique de commandes.',
            'Les détails de réparation et d’hébergement : modèles, numéros de série, journaux et photos que vous nous envoyez.',
            'Les messages et appels avec notre équipe.',
            'Nous ne conservons pas les numéros de carte complets. Les paiements par carte sont traités par Moneris.',
          ],
        },
        {
          h: 'Pourquoi nous les utilisons',
          list: [
            'Pour répondre à vos questions et préparer des soumissions.',
            'Pour traiter, expédier et soutenir vos commandes, réparations, garanties et hébergement.',
            'Pour vous envoyer des mises à jour de commande, d’expédition et de réparation.',
            'Pour vous envoyer des offres, seulement si vous y avez consenti. Vous pouvez vous désabonner en tout temps.',
            'Pour respecter nos obligations comptables, fiscales et légales, et prévenir la fraude.',
          ],
        },
        {
          h: 'Avec qui nous les partageons',
          p: ['Nous partageons seulement le nécessaire avec les fournisseurs qui nous aident à exploiter l’entreprise. Nous ne vendons pas de renseignements personnels.'],
          list: [
            'Lightspeed (Ecwid) : boutique en ligne, panier et commandes.',
            'Moneris : paiements par carte.',
            'Netlify : hébergement du site et formulaires du site.',
            'Transporteurs : livraison de votre commande.',
            'Notre comptable et les autorités gouvernementales, lorsque la loi l’exige.',
          ],
        },
        {
          h: 'Renseignements conservés hors du Québec',
          p: ['Certains de ces fournisseurs conservent des renseignements à l’extérieur du Québec ou du Canada, par exemple aux États-Unis. Nous faisons affaire avec des fournisseurs qui protègent les renseignements selon les principes généralement reconnus.'],
        },
        {
          h: 'Témoins (cookies)',
          p: ['La boutique utilise les témoins nécessaires au panier, au paiement et au compte. Avec votre consentement, elle peut aussi utiliser des témoins pour mesurer la performance du site. Vous pouvez choisir dans l’avis sur les témoins ou les bloquer dans votre navigateur, mais le panier pourrait ne pas fonctionner sans eux.'],
        },
        {
          h: 'Durée de conservation',
          p: ['Nous conservons les renseignements personnels seulement le temps nécessaire aux fins pour lesquelles ils ont été recueillis, et aussi longtemps que les lois fiscales et comptables l’exigent pour les transactions. Ensuite, nous les détruisons ou les rendons anonymes.'],
        },
        {
          h: 'Sécurité',
          p: ['Nous utilisons des mesures de sécurité raisonnables et limitons l’accès aux personnes qui en ont besoin. Les données de carte sont traitées par Moneris, pas conservées par nous.'],
        },
        {
          h: 'Vos droits',
          list: [
            'Demander à consulter les renseignements personnels que nous détenons sur vous.',
            'Nous demander de les corriger.',
            'Retirer votre consentement, par exemple aux courriels promotionnels.',
            'Nous demander de cesser de les diffuser, ou de les recevoir dans un format courant.',
          ],
          p: [
            'Envoyez votre demande à info@canadabtcminers.ca. Nous répondons dans un délai de 30 jours.',
            'Si vous n’êtes pas satisfait, vous pouvez vous adresser à la Commission d’accès à l’information du Québec ou au Commissariat à la protection de la vie privée du Canada.',
          ],
        },
        {
          h: 'Modifications',
          p: ['Nous pouvons mettre cette politique à jour. La version en vigueur est toujours sur cette page, avec sa date.'],
        },
      ],
    },
    terms: {
      title: 'Conditions de vente',
      seoDescription: 'Conditions de vente des mineurs ASIC, pièces et accessoires de Canada BTC Miners : prix, paiement, vente finale, garantie et responsabilité.',
      intro: 'Ces conditions s’appliquent à tout achat chez Canada BTC Miners, en ligne, par téléphone ou sur facture. En passant une commande, vous les acceptez.',
      sections: [
        {
          h: 'Prix et taxes',
          list: [
            'Les prix sont en dollars canadiens, sauf indication contraire.',
            'Les prix et la disponibilité peuvent changer jusqu’à la confirmation de votre commande. Si un prix est manifestement erroné, nous pouvons annuler la commande et rembourser tout paiement en entier.',
            'Les taxes (TPS, TVQ, TVH, etc.) sont ajoutées selon votre adresse de livraison.',
          ],
        },
        {
          h: 'Commandes et paiement',
          list: [
            'Votre commande est confirmée lorsque le paiement complet est reçu.',
            'En ligne : carte de crédit ou de débit, traitée par Moneris.',
            'Virement Interac, virement bancaire, crypto ou comptant : contactez-nous et nous vous enverrons une facture.',
            'Gros lots, commandes en volume et soumissions : les conditions écrites sur votre soumission ou facture s’appliquent lorsqu’elles diffèrent de celles-ci.',
          ],
        },
        {
          h: 'Expédition',
          p: ['Les commandes sont expédiées de 2 à 12 jours ouvrables après la réception du paiement complet, selon la disponibilité et le modèle. Voir notre politique d’expédition et de retours.'],
        },
        {
          h: 'Toutes les ventes sont finales',
          p: ['Nous n’offrons aucun remboursement, retour ou échange. Cela inclut un changement d’avis, une erreur de modèle commandé et les variations de difficulté, du prix des cryptomonnaies ou de la rentabilité. Les appareils défectueux sont traités selon notre politique de garantie.'],
        },
        {
          h: 'Garantie',
          p: ['Les appareils neufs sont couverts par la garantie du fabricant. Les appareils usagés et remis à neuf ont une garantie de 30 jours de notre centre de réparation. Les gros lots ont une période DOA de 7 jours, sauf indication contraire sur votre facture. Voir notre politique de garantie.'],
        },
        {
          h: 'Utilisation de votre équipement',
          list: [
            'Les mineurs ASIC sont des appareils industriels à forte puissance. Vous êtes responsable de l’installation électrique, du refroidissement et de la ventilation, ainsi que du respect des règles locales.',
            'Les résultats de minage dépendent de la difficulté du réseau, du prix des cryptomonnaies et du coût de l’électricité. Nous ne garantissons aucun revenu ni profit de minage.',
          ],
        },
        {
          h: 'Limitation de responsabilité',
          p: ['Dans la mesure permise par la loi, notre responsabilité totale pour une commande est limitée au prix payé pour le produit. Nous ne sommes pas responsables des profits perdus, des revenus de minage perdus, des coûts d’électricité ni des autres pertes indirectes.'],
        },
        {
          h: 'Différends de paiement',
          p: ['Si votre commande pose problème, contactez-nous d’abord. Nous travaillerons avec vous pour le régler.'],
        },
        {
          h: 'Vos droits légaux',
          p: [LEGAL_RIGHTS_FR],
        },
        {
          h: 'Loi applicable',
          p: ['Ces conditions sont régies par les lois du Québec et les lois fédérales du Canada qui s’y appliquent.'],
        },
        {
          h: 'Nous joindre',
          p: [CONTACT_FR],
        },
      ],
    },
    shipping: {
      title: 'Expédition et retours',
      seoDescription: 'Délais, coûts et suivi d’expédition des mineurs ASIC de Canada BTC Miners, et notre politique de vente finale.',
      intro: 'Quand et comment votre commande est expédiée, ce que coûte la livraison, et notre politique de retours.',
      sections: [
        {
          h: 'Délai d’expédition',
          p: ['Les commandes sont expédiées de 2 à 12 jours ouvrables après la réception du paiement complet, selon la disponibilité et le modèle.'],
        },
        {
          h: 'Coût de livraison',
          list: [
            'Appareils neufs : la livraison est incluse.',
            'Appareils usagés et remis à neuf, pièces et accessoires : le coût de livraison est indiqué au paiement ou sur votre facture.',
          ],
        },
        {
          h: 'Suivi',
          p: ['Nous vous envoyons un numéro de suivi par courriel lorsque votre commande est expédiée.'],
        },
        {
          h: 'À la réception',
          p: ['Vérifiez les boîtes à la réception. Si vous voyez des dommages de transport, signalez-les au transporteur, prenez des photos et contactez-nous immédiatement, pendant votre période de garantie ou DOA.'],
        },
        {
          h: 'Retours, remboursements et échanges',
          p: [
            'Toutes les ventes sont finales. Nous n’acceptons aucun retour, remboursement ou échange, y compris pour un changement d’avis ou une erreur de modèle commandé.',
            'Une fois le paiement reçu, les commandes ne peuvent pas être annulées. Si nous ne pouvons pas remplir votre commande, nous remboursons le montant complet.',
            'Les appareils défectueux sont traités selon notre politique de garantie.',
          ],
        },
        {
          h: 'Vos droits légaux',
          p: [LEGAL_RIGHTS_FR],
        },
        {
          h: 'Questions',
          p: [CONTACT_FR],
        },
      ],
    },
    warranty: {
      title: 'Garantie',
      seoDescription: 'Garantie des mineurs ASIC de Canada BTC Miners : garantie du fabricant sur les appareils neufs, 30 jours sur les usagés et les réparations, DOA de 7 jours sur les gros lots.',
      intro: 'Ce qui est couvert sur l’équipement que vous achetez ou faites réparer chez nous, et comment faire une réclamation.',
      sections: [
        {
          h: 'Appareils neufs',
          p: ['Les appareils neufs sont couverts par la garantie d’origine du fabricant (par exemple Bitmain ou MicroBT). Le fabricant fixe les conditions et traite la réclamation. Nous pouvons vous aider dans la démarche.'],
        },
        {
          h: 'Appareils usagés et remis à neuf',
          p: ['Les appareils usagés et remis à neuf ont une garantie de 30 jours de notre centre de réparation de Montréal, à partir de la date de livraison ou de cueillette. Si l’appareil tombe en panne lors d’une utilisation normale pendant cette période, nous le réparons à notre centre. Cette garantie est une réparation, pas un remboursement.'],
        },
        {
          h: 'Réparations',
          p: ['Les réparations ont une garantie de 30 jours sur le problème réparé, sauf indication contraire sur votre facture de réparation.'],
        },
        {
          h: 'Gros lots : DOA de 7 jours',
          p: ['Les gros lots et commandes en volume ont une période DOA (arrivé défectueux) de 7 jours à partir de la date de livraison, sauf si d’autres conditions sont écrites sur votre soumission ou facture. Signalez les appareils DOA dans les 7 jours avec les numéros de série, des photos et les journaux du mineur.'],
        },
        {
          h: 'Ce qui n’est pas couvert',
          list: [
            'Dommages physiques, chutes ou dommages causés par un liquide.',
            'Dommages causés par une mauvaise tension, une surtension ou une installation électrique inadéquate.',
            'Surchauffe due à une mauvaise ventilation, ou accumulation importante de poussière.',
            'Appareils ouverts, réparés ou modifiés par quelqu’un d’autre, ou dont les sceaux de garantie ont été retirés.',
            'Micrologiciel personnalisé ou surcadençage.',
            'Dommages de transport non signalés à la réception.',
          ],
        },
        {
          h: 'Faire une réclamation',
          p: ['Contactez-nous avec votre numéro de commande ou de facture, le numéro de série de l’appareil, une courte description du problème et, si possible, les journaux du mineur. Nous vous indiquerons les prochaines étapes.'],
        },
        {
          h: 'Vos droits légaux',
          p: [LEGAL_RIGHTS_FR],
        },
        {
          h: 'Nous joindre',
          p: [CONTACT_FR],
        },
      ],
    },
  },
};

/** English route for each policy page (French is the same under /fr). */
export const LEGAL_PATHS: Record<LegalDocKey, string> = {
  privacy: '/privacy',
  terms: '/terms',
  shipping: '/shipping-returns',
  warranty: '/warranty',
};
