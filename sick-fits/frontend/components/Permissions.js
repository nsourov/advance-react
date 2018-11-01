import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";
import { check } from "graphql-anywhere";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATIONS = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      return (
        <div>
          <Error error={error} />
          <div>
            <h2>Manage permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map((permission, i) => (
                    <th key={i}>{permission}</th>
                  ))}
                  <th>👇</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user, i) => (
                  <UserPermissions user={user} key={i} />
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      );
    }}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };
  state = {
    permissions: this.props.user.permissions
  };
  handlePermissionChange = e => {
    const checkbox = e.target;
    // take a copy of the current permission
    let updatedPermissions = [...this.state.permissions];
    // figure out if need to remove or add permission
    if (checkbox.checked) {
      // add it
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission != checkbox.value
      );
    }
    this.setState({ permissions: updatedPermissions });
  };
  render() {
    const { user } = this.props;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATIONS}
        variables={{
          permissions: this.state.permissions,
          userId: user.id
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {possiblePermissions.map((permission, i) => (
              <td key={i}>
                <label htmlFor={`${user.id}-permission-${permission}`}>
                  <input
                    id={`${user.id}-permission-${permission}`}
                    type="checkbox"
                    checked={this.state.permissions.includes(permission)}
                    value={permission}
                    onChange={this.handlePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <SickButton onClick={updatePermissions} disabled={loading}>
                Updat
                {loading ? "ing" : "e"}
              </SickButton>
            </td>
          </tr>
        )}
      </Mutation>
    );
  }
}

export default Permissions;
