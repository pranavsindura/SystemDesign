#include <cassert>
#include <iostream>
#include <map>
#include <string>
#include <tuple>
#include <vector>
using namespace std;
typedef long long ll;
int MAXN = 1024;

ll create_hash(string k) {
  ll rolling = 0;
  const ll MOD = 1e9 + 9;
  const ll P = 263;
  ll p_pow = 1;
  for (char x : k) {
    rolling = rolling + x * p_pow;
    rolling %= MOD;
    p_pow *= P;
    p_pow %= MOD;
  }

  return rolling;
}

class Database {
  map<string, string> table;

public:
  Database() {}

  void add_entry(string key, string value) { table[key] = value; }
  string get_entry(string key) { return table[key]; }
} db;

class Server {
  string machine_id;
  int replication_count;

  map<string, string> table;

public:
  Server(string id, int count) {
    machine_id = id;
    replication_count = count;
    cout << "Created Server " << id << ", " << count << endl;
  }

  string get_machine_id() { return machine_id; }
  int get_replication_count() { return replication_count; }

  void add_entry(string key, string value) { table[key] = value; }
  tuple<bool, string> get_entry(string key) {
    if (table.count(key) == 0) {
      string value = db.get_entry(key);
      add_entry(key, value);
      return {false, table[key]};
    }

    return {true, table[key]};
  }
};

class VirtualServer {
  Server *server;
  int index;

  string key;
  int key_hash;

  bool operator<(VirtualServer b) { return key_hash < b.key_hash; }

public:
  VirtualServer(Server *s, int i) {
    server = s;
    index = i;
    key = s->get_machine_id() + '/' + to_string(i);
    key_hash = create_hash(key);
    cout << "Created VirtualServer " << key << ", " << key_hash << ", " << endl;
  }

  int get_key_hash() { return key_hash; }
  Server *get_server() { return server; }
};

class HashRing {
  map<int, VirtualServer *> ring;
  map<string, vector<VirtualServer *>> virtualServerMapList;
  map<string, Server *> serverMap;

public:
  void add_server(string machine_id, int replication_count) {
    Server *s = new Server(machine_id, replication_count);
    for (int i = 0; i < s->get_replication_count(); i++) {
      VirtualServer *vs = new VirtualServer(s, i);

      assert(ring.count(vs->get_key_hash()) == 0);

      ring[vs->get_key_hash()] = vs;
      virtualServerMapList[s->get_machine_id()].push_back(vs);
    }
    serverMap[s->get_machine_id()] = s;
  }

  void remove_server(string machine_id) {
    for (VirtualServer *vs : virtualServerMapList[machine_id]) {
      ring.erase(vs->get_key_hash());
      delete vs;
    }
    virtualServerMapList.erase(machine_id);
    delete serverMap[machine_id];
    serverMap.erase(machine_id);
  }

  tuple<bool, string, Server *> get_entry(string key) {
    int key_hash = create_hash(key);
    auto it = ring.lower_bound(key_hash);
    if (it == ring.end()) {
      it = ring.begin();
    }
    auto result = it->second->get_server()->get_entry(key);
    bool cache_hit;
    string value;
    tie(cache_hit, value) = result;
    return {cache_hit, value, it->second->get_server()};
  }
};

int main() {
  /*
   * Queries
   * 1 <machineId> <replicationCount> -> Add machine to the group of servers, no
   * repeat
   *
   * 2 <machineId> -> Remove machine from the group of servers, machine
   * will exist
   *
   * 3 <key> <value> -> Set data for <key> = <value>
   *
   * 4 <key> -> Get <value> <machineId> <cache hit/miss> for key
   */

  HashRing *ring = new HashRing();

  int queries = 0;
  cin >> queries;
  while (queries--) {
    int q;
    cin >> q;
    switch (q) {
    case 1: {
      string machine_id;
      int replication_count;
      cin >> machine_id >> replication_count;
      ring->add_server(machine_id, replication_count);
      break;
    }
    case 2: {
      string machine_id;
      cin >> machine_id;
      ring->remove_server(machine_id);
      cout << "Removed Server: " << machine_id << endl;
      break;
    }
    case 3: {
      string key, value;
      cin >> key >> value;
      db.add_entry(key, value);
      cout << "Added: " << key << " -> " << value << endl;
      break;
    }
    case 4: {
      string key;
      cin >> key;
      bool cache_hit;
      string result;
      Server *s;
      tie(cache_hit, result, s) = ring->get_entry(key);
      cout << (cache_hit ? "Cache Hit: " : "Cache Miss: ") << key << " -> "
           << result << ", on Server " << s->get_machine_id() << endl;
      break;
    }
    default:
      break;
    }
  }
}
