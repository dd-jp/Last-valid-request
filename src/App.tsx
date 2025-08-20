import { useEffect, useState, useRef } from 'react';

import './App.css';

type TUser = {
  id: number;
  name: string;
};

type TAlbum = {
  userId: number;
  id: number;
  title: string;
};

function App() {
  const [users, setUsers] = useState<TUser[] | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<number | undefined>(
    undefined
  );
  const [albums, setAlbums] = useState<TAlbum[] | undefined>();

  const currentRequestId = useRef(0);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch('https://jsonplaceholder.typicode.com/users');

      if (data.status === 200) {
        const users = await data.json();
        setUsers(users);
      }
    };
    void getData();
  }, []);

  useEffect(() => {
    const getData = async (userId: number) => {
      const requestId = ++currentRequestId.current;

      const data = await fetch(
        `https://jsonplaceholder.typicode.com/albums?userId=${userId}`
      );

      if (data.status === 200) {
        const album = await data.json();
        if (requestId === currentRequestId.current) {
          console.log('updated');
          setAlbums(album);
        }
      }
    };
    if (selectedUser) {
      void getData(selectedUser);
    }
  }, [selectedUser]);

  return (
    <div>
      {users?.map((user) => (
        <button
          key={user.id}
          onClick={() => {
            setSelectedUser(user.id);
          }}
        >
          {user.name}
        </button>
      ))}
      <div style={{ padding: '10px' }}>
        <b>Albums</b>
        <ul>
          {albums?.map((album) => (
            <li key={album.id}>{album.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
