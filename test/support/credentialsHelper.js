export function getCaseworkerCredentials(role = 'writer') {
  const password = process.env.ENTRA_ID_USER_PASSWORD

  const users = {
    admin: {
      username: process.env.ENTRA_ID_ADMIN_USER,
      role: 'SA-FGCW ADMIN (Equal Experts)'
    },
    reader: {
      username: process.env.ENTRA_ID_READER_USER,
      role: 'fgcw reader (Equal Experts)'
    },
    writer: {
      username: process.env.ENTRA_ID_WRITER_USER,
      role: 'SA-FGCW WRITER (Equal Experts)'
    }
  }

  const selectedUser = users[role]

  if (!selectedUser?.username || !password) {
    throw new Error(`Missing credentials for Caseworking role: ${role}`)
  }

  return {
    username: selectedUser.username,
    password,
    role: selectedUser.role
  }
}

export function getGrantsCredentials() {
  const username = process.env.DEFRA_ID_GRANTS_USER
  const password = process.env.DEFRA_ID_GRANTS_PASSWORD

  if (!username || !password) {
    throw new Error('Missing Grants credentials')
  }

  return { username, password }
}
