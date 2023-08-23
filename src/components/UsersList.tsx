import { SortBy, type User } from "../types.d";

interface Props {
  changeSorting: (sort: SortBy) => void,
  deleteUser: (email: string) => void,
  showColors: boolean,
  users: User[]
}
export function UsersList({ users, showColors, deleteUser, changeSorting }: Props) {
  return (
    <table style={{width: '100%'}}>
      <thead>
        <tr>
          <th>Photo</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.NAME)}>Name</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.LAST)}>LastName</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.COUNTRY)}>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody className={showColors ? 'table--showColors' : ''}>
        {
          users.map((user, _) => {
            return (
              <tr key={user.email}>
                <td>
                  <img src={user.picture.thumbnail} />
                </td>
                <td>
                  {user.name.first}
                </td>
                <td>
                  {user.name.last}
                </td>
                <td>
                  {user.location.country}
                </td>
                <td>
                  <button onClick={() => {deleteUser(user.email)}}>Delete</button>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}