import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const subscriptionTypes = [
  {
    id: 'pt-4x',
    name: 'Personal Training 4x',
    sessionsPerMonth: 4,
    price: 315,
    type: 'personal',
    features: [
      'Duurzame voedingsadviezen',
      '1 op 1 personal training',
      'Elke 6 weken een progressie meting',
      'Elke 6 weken een nieuw trainingsschema'
    ]
  },
  {
    id: 'pt-8x',
    name: 'Personal Training 8x',
    sessionsPerMonth: 8,
    price: 546,
    type: 'personal',
    features: [
      'Duurzame voedingsadviezen',
      '1 op 1 personal training',
      'Elke 6 weken een progressie meting',
      'Elke 6 weken een nieuw trainingsschema'
    ]
  },
  {
    id: 'pt-12x',
    name: 'Personal Training 12x',
    sessionsPerMonth: 12,
    price: 693,
    type: 'personal',
    features: [
      'Duurzame voedingsadviezen',
      '1 op 1 personal training',
      'Elke 6 weken een progressie meting',
      'Elke 6 weken een nieuw trainingsschema'
    ]
  },
  {
    id: 'sgt-1x',
    name: 'Small Group Training 1x',
    sessionsPerMonth: 4,
    price: 60,
    type: 'group',
    features: [
      'Aandacht voor techniek en verantwoord sporten',
      'In een groep van max 8 werken aan je persoonlijke doelstelling',
      'De gezelligheid en betrokkenheid van het samen trainen'
    ],
    schedule: [
      'Dinsdag 19:00-20:00',
      'Woensdag 20:00-21:00',
      'Donderdag 19:00-20:00',
      'Donderdag 20:00-21:00',
      'Zaterdag 9:30-10:30',
      'Zondag 10:00-11:00'
    ]
  },
  {
    id: 'sgt-2x',
    name: 'Small Group Training 2x',
    sessionsPerMonth: 8,
    price: 100,
    type: 'group',
    features: [
      'Aandacht voor techniek en verantwoord sporten',
      'In een groep van max 8 werken aan je persoonlijke doelstelling',
      'De gezelligheid en betrokkenheid van het samen trainen'
    ],
    schedule: [
      'Dinsdag 19:00-20:00',
      'Woensdag 20:00-21:00',
      'Donderdag 19:00-20:00',
      'Donderdag 20:00-21:00',
      'Zaterdag 9:30-10:30',
      'Zondag 10:00-11:00'
    ]
  }
];

export async function seedSubscriptionTypes() {
  try {
    const subscriptionCollection = collection(db, 'subscriptionTypes');
    
    for (const subscription of subscriptionTypes) {
      const { id, ...subscriptionData } = subscription;
      await setDoc(doc(subscriptionCollection, id), subscriptionData);
      console.log(`Added subscription type: ${subscription.name}`);
    }
    
    console.log('All subscription types have been added successfully!');
  } catch (error) {
    console.error('Error adding subscription types:', error);
  }
} 