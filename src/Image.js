import React from 'react';

export default class Image extends React.Component {
  constructor() {
    super()

    this.state = {
      loading: true,
      name: '',
      source: '',
      dogs: [],
    }

    this.fetchImage = this.fetchImage.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.image = this.image.bind(this);
    this.clearButton = this.clearButton.bind(this);
  }

  async componentDidMount() {
    const { loading } = this.state;
    const dogs = JSON.parse(localStorage.getItem('dogs'));

    if (dogs) {
      if (dogs.length > 0) {
        this.setState({ 
          loading: false, 
          source: dogs[dogs.length-1].source, 
          dogs,
         })
        return 'done';
      }
    }

    if (loading) this.fetchImage();
  }

  componentDidUpdate(prevProps, prevState) {
    const { loading, source, dogs } = this.state;
    const prevSource = prevState.source;

    if (dogs.length > 0) {
      localStorage.setItem('dogs', JSON.stringify(dogs))
    }

    if (source !== prevSource && !loading) {
      alert(this.getSpecie(source));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { source } = nextState;

    if (source.includes('terrier')) {
      return false;
    };
    return true
  }

  getSpecie(str) {
    return `A raça do dog é ${str.substr(30).split('/')[0].split('-')
      .map(word => {
        return word.charAt(0).toUpperCase() + word.substring(1)
      }).join(' ')}.`;
  }

  async fetchImage() {
    this.setState(
      { loading: true },
      async () => {
        const URL = 'https://dog.ceo/api/breeds/image/random';
        const response = await fetch(URL);
        const dataJson = await response.json();
        const dogUrl = dataJson.message;
        this.setState({
          loading: false,
          source: dogUrl,
        })
      });
  }

  handleSave() {
    const { name, source, dogs } = this.state;
    const newDog = {
      name,
      source,
    };
    this.setState(({
      name: '',
      dogs: [ ...dogs, newDog ],
    }))
  }

  handleName({ target }) {
    const { value } = target;
    this.setState({ name: value });
  }

  image(obj) {
    const { source } = obj;

    return (
      <div className="container-vertical">
        <img id="dog-img" src={ source } alt="Imagem do doggo" />
      </div>
    )
  }

  clearButton() {
    localStorage.removeItem('dogs');
    this.setState({ dogs: [] });
  }

  render() {
    const { loading, name, dogs } = this.state;
    const { fetchImage, handleName, handleSave, image, clearButton } = this;
    const loadingText = <p id="loading">Loading...</p>;

    const dogFetch = (
      <div className="container-vertical">
        <h1 className="dog-title">DOGGO!!</h1>
        { image(this.state) }
        <input id="name-input" value={ name } onChange={ handleName } placeholder="Dẽ um nome para o dog!"/>
        <div className="container">
          <button id="fetch-btn" onClick={ fetchImage }>Buscar</button>
          <button id="save-btn" onClick={ handleSave }>Salvar</button>
          <button id="clear-btn" onClick={ clearButton }>Limpar</button>
        </div>
      </div>
    )

    const dogList = (
      <div>
        <h1 className="dog-title">Dogs Salvos</h1>
        <div className="card-container">
          { dogs.map((dog) => (
            <div key={ dog.name } className="container-vertical">
              { image(dog) }
              <h1 className="dog-title">{ dog.name }</h1>
            </div>
          ))}
        </div>
      </div>
    )

    return (
      <div>
        {loading ? loadingText : dogFetch }
        { dogs.length > 0 && dogList }
      </div>
    )
  }
}
