const headers = {
  'Content-Type': 'application/json'
};

const getConfigs = async () => {
  const response = await fetch('http://localhost:3001');
  const items = await response.json();
  return items;
}

const createConfig = async (name) => {
  const response = await fetch('http://localhost:3001', { method: 'POST', headers, body: JSON.stringify({name})});
  const item = await response.json();
  return item;
}

const changeConfig = async (id, config) => {
  const response = await fetch(`http://localhost:3001/${id}`, { method: 'PATCH', headers, body: JSON.stringify(config)});
  const item = await response.json();
  return item;
}

const removeConfig = async (id) => {
  const response = await fetch(`http://localhost:3001/${id}`, { method: 'DELETE', headers });
  const item = await response.json();
  return item;
}

// $(document).ready(() => {
//     const switches = document.getElementById('switches');
//     const configName = document.getElementById('configName')
//     const addConfig = document.getElementById('addConfig')

//     addConfig.addEventListener('click', () => {
//         console.log('yo')
//         createConfig(configName.value).then(item => {
//             const row = document.createElement('div');
//             row.innerHTML = JSON.stringify(item);
//             switches.appendChild(row);
//             configName.value = '';
//         })
//     })

//     switches.innerHTML = '';
//     getConfigs().then(items => {
//         items.forEach(item => {
//             const row = document.createElement('div');
//             row.innerHTML = JSON.stringify(item);
//             switches.appendChild(row);
//         })
//     })
// })

function Switch({ item, itemRemoved }) {
  const [value, setValue] = React.useState(item.state);

  const handleChange = React.useCallback((id, state) => {
      changeConfig(id, {state}).then(config => setValue(config.state))
  }, [changeConfig, setValue])

  const handleRemove = React.useCallback((id) => {
    console.log({id})
    removeConfig(id).then(() => itemRemoved(id))
}, [removeConfig, itemRemoved])

  return <form class="p-2">
      <div class="row">
        <div class="col-9 d-flex align-items-center">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id={`check-${item.id}`}
            checked={value} onChange={e => handleChange(item.id, e.target.checked)} />
          <label class="form-check-label" for={`check-${item.id}`}>
            {item.name}
          </label>
        </div>
        </div>
        <div class="col-3 text-end">
          <button type="button" class="btn btn-primary" onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      </div>
  </form>
}

function Switches({ items, itemRemoved }) {  
  return <div class="p-2">
    {items.map(item => <Switch item={item} itemRemoved={itemRemoved} />)}
  </div>
}

function App() {
  const [configs, setConfigs] = React.useState([])

  const handleRemove = React.useCallback((id) => {
    setConfigs([...configs.filter(c => c.id !== id)]);
}, [configs, setConfigs])

  React.useEffect(() => {
    let ready = true;
    getConfigs().then(items => {
      if (ready) {
        setConfigs(items);
      }
    })

    return () => { ready = false; }
  }, [])

  return <div>
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Navbar</span>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <Switches items={configs} itemRemoved={handleRemove} />
        </div>
        <div class="col">
          Placeholder
        </div>
      </div>
    </div>
  </div>;
}

ReactDOM.render(<App />, document.getElementById('root'))