// TODO
// Sort methods
// update showUserRegistration to save email to local storage, check value before display prompt. set state flag when email is not there

'use strict';

var React = require('react-native');
var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

var {
  Alert,
  AlertIOS,
  AppRegistry,
  Image,
  LinkingIOS,
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
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.movieList} />
    )
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
        style={styles.movieList} />
    )
  },

  // allow user to set email address
  showRegistration: function() {
    AlertIOS.alert(
      'Enter Your Email',
      'Enter your email address here and you\'ll be notified once movies of your choosing are available on DVD. Don\'t worry, you can do this later.',
      [
        {text: 'Maybe Later', onPress: () => this.setState({showRegistration: false})},
        {text: "Save", onPress: (text) => this.setState({email: text, showRegistration: false})}
      ],
      'plain-text'
    )
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
          // onPress={() => LinkingIOS.openURL(movie.links.alternate)} >
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

  sortMoviesByRating: function() {
    var sorted = this.state.rawData.sort(function(a, b) {
      return a.ratings.audience_score - b.ratings.audience_score
    }).reverse();

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(sorted),
      rawData: sorted,
    })
  },

  // sortMoviesByTitle: function() {

  // },

  // sortMoviesByReleaseDate: function() {

  // },

});

var styles = StyleSheet.create({

  container: {
    margin: 50
  },
  
  userEmailInput: {
    width: 200,
    height: 200,
    color: 'gray'
  },
  
  listView: {
    paddingTop: 50,
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
  },

  moviePosterContainer: {
  },

  movieInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },

  movieTitle: {
    flex: 2,
    textAlign: 'center',
    marginRight: 10,
  },

  movieYear: {
    textAlign: 'center',
    marginRight: 10,

  },

  movieAudienceScore: {
    textAlign: 'center',
    marginRight: 10,

  },

  movieSynopsis: {

  },

  moviePoster: {
    width: 53,
    height: 81,
  },


});

AppRegistry.registerComponent('ondvd', () => ondvd);
