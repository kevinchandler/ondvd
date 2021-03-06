'use strict';

var React = require('react-native');
var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

var {
  Alert,
  AppRegistry,
  Image,
  IntentAndroid,
  ListView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} = React;

var ondvd = React.createClass({

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      moviesLoaded: false,
      showRegistration: false, //default to false
      email: '',
    }
  },

  componentDidMount: function() {
    this.fetchMovies();
  },
  
  render: function() {

    // Is the user registered?
    // Extract this to check before user tries to save movie
    if (this.state.showRegistration) {
      this.showRegistration();
    }

    // Have movies loaded yet?
    if (!this.state.moviesLoaded) {
      return this.renderLoadingView();
    }

    // Display movies
    return this.renderMoviesInTheaters();
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading Movies
        </Text>
      </View>
    );
  },

  renderMoviesInTheaters: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.movieList}  />
    )
  },

  // allow user to set email address
  showRegistration: function() {
    // TODO
  },

  fetchMovies: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          rawData: responseData.movies,
          moviesLoaded: true,
        });
      })
      .done();
  },

  renderMovie: function(movie) {
    return (
      <TouchableWithoutFeedback
          // onPress={() => IntentAndroid.openURL(movie.links.alternate)} >
          onPress={() => this.showMovieSynopsis(movie) } >
        
        <View style={styles.listView}>
          <Image
            source={{uri: movie.posters.original}}
            style={styles.moviePoster} />
          
          <View style={styles.movieInfoContainer}>
            <Text style={styles.movieTitle}>
              {movie.title} 
            </Text>
            
            <Text style={styles.movieYear}>
              {movie.year}
            </Text>

            <Text style={styles.movieAudienceScore}>
              {movie.ratings.audience_score}
            </Text>
            
            <Text style={styles.movieSynopsis}>
              {movie.synopsis}
            </Text>
          </View>

        </View>

      </TouchableWithoutFeedback>
    )
  },

  showMovieSynopsis: function(movie) {
    if (movie && movie.synopsis && movie.synopsis.length) {
      Alert.alert(movie.title, movie.synopsis);
    } else {
      Alert.alert('Oh no!', 'It looks like the synopsis is unavailable :(')
    }
  },

});

var styles = StyleSheet.create({

  container: {
    margin: 50,
  },
  
  listView: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#34495e',
    borderWidth: 1,
    borderColor: 'black',
  },

  moviePosterContainer: {
    flex: 1,
  },

  movieInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
    maxHeight: 50,
  },

  movieTitle: {
    flex: 2,
    flexWrap: 'wrap',
    color: '#ecf0f1',
    textAlign: 'center',
    marginRight: 10,
  },

  movieYear: {
    flex: 1,
    color: '#ecf0f1',
    textAlign: 'center',
    marginRight: 10,

  },

  movieAudienceScore: {
    color: '#ecf0f1',
    textAlign: 'center',
    marginRight: 10,

  },

  movieSynopsis: {
    color: '#ecf0f1',
  },

  moviePoster: {
    width: 53,
    height: 81,
  },

});

AppRegistry.registerComponent('ondvd', () => ondvd);