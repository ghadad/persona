const MOCK_TRUE = true;

// set ldap as injectable service

class Ldap {
  async authenticate(username: string, password: string) {
    if (MOCK_TRUE && username.match(/ghadad|golan/)) {
      return true;
    }
    return false;
  }
}

class LdapService {
  ldap = new Ldap();
  constructor() {}

  async authenticate(username: string, password: string) {
    return await this.ldap.authenticate(username, password);
  }
}

export default new LdapService();
