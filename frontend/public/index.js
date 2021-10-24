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

function Switch({ isEdit, item, itemRemoved }) {
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
        {isEdit && <div class="col-3">
          <button type="button" class="btn btn-primary w-100" onClick={() => handleRemove(item.id)}>Remove</button>
        </div>}
      </div>
  </form>
}

function Switches({ isEdit, items, itemRemoved, itemAdded }) {  
  const [value, setValue] = React.useState('')

  const handleCreate = React.useCallback(() => {
    createConfig(value).then(config => {
      setValue('');
      itemAdded(config);
    });

  }, [value, setValue])

  return <div class="p-2">
    {items.map(item => <Switch isEdit={isEdit} item={item} itemRemoved={itemRemoved} />)}
    {isEdit && <div class="row p-2">
      <div class="col-9">
        <input type="text" class="form-control" value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <div class="col-3">
        <button class="btn btn-primary w-100" type="button" onClick={handleCreate}>Add</button>
      </div>
    </div>}
  </div>
}

function App() {
  const [configs, setConfigs] = React.useState([])
  const [isEdit, setIsEdit] = React.useState(false)

  const handleAdd = React.useCallback((item) => {
    setConfigs([...configs, item]);
  }, [configs, setConfigs])

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
        <span class="navbar-brand mb-0 h1">IOT Dashboard</span>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row p-3">
        <div class="col">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="is-edit-switch"
            checked={isEdit} onChange={e => setIsEdit(e.target.checked)} />
          <label class="form-check-label" for="is-edit-switch">Manage</label>
        </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <Switches isEdit={isEdit} items={configs} itemRemoved={handleRemove} itemAdded={handleAdd} />
        </div>
        <div class="col">
          Placeholder
        </div>
      </div>
    </div>
  </div>;
}

ReactDOM.render(<App />, document.getElementById('root'))