import type { FC } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useClientes } from '../hooks/useClientes';
import { IonPage } from '@ionic/react';

const Home: FC = () => {
  const { data, isLoading, error } = useClientes();

  if (isLoading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error al cargar clientes</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {data?.map((cliente) => (
          <div key={cliente.id}>
            {cliente.nombre} — {cliente.telefono}
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
