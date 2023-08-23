import { useEffect, useState, useRef, useMemo } from 'react';
import { SortBy, type User } from './types.d';

import './App.css'
import { UsersList } from './components/UsersList';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const originalUsers = useRef<User[]>([]);
  // useRef -> save a value to be shared among renders
  // but, wheneve it changes, the UI/Component is not rendered again

  const toggleShowColors = () => {
    setShowColors(prevState => !prevState);
  };

  const toggleSortByCountry = () => {
    const newSorting = sorting != SortBy.COUNTRY ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSorting);
  }

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
    ? users.filter(user => {
      return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
    })
    : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {

    if (sorting === SortBy.NONE) return filteredUsers;

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
    }

    const getProperty = compareProperties[sorting];

    // toSorted
    return [...filteredUsers].sort((a, b) => {
      return getProperty(a).localeCompare(getProperty(b));
    });
  }, [filteredUsers, sorting])

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email != email);
    setUsers(filteredUsers);
  }

  const handleReset = () => {
    setUsers(originalUsers.current);
  }

  const handleChangeSorting = (value: SortBy) => {
    setSorting(value);
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        const results = res?.results ?? [];
        setUsers(results);
        originalUsers.current = results;
      })
      .catch(err => {
        console.log(err)
      });
  }, []);

  return (
    <div className='App'>
      <header>
        <button onClick={toggleShowColors}>
          Color rows
        </button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'Reset sort' : 'Sort by country' }
        </button>
        <button onClick={handleReset}>Reset users</button>
        <input type="text" placeholder="Filter by country" onChange={(e) => {
          setFilterCountry(e.target.value);
        }}/>
      </header>
      <main>
        <UsersList users={sortedUsers} showColors={showColors} deleteUser={handleDelete} changeSorting={handleChangeSorting} />
      </main>
    </div>
  )
}

export default App
