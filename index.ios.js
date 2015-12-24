'use strict';

var React = require('react-native');
var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json'

var {
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
      loaded: false,
    }
  },

  componentDidMount: function() {
    this.fetchMovies();
  },
  
  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.movieList} />
    )
  },

  renderLoadingView: function() {
    return (
      <View>
        <Text>
          Loading Movies
        </Text>
      </View>
    );
  },

  fetchMovies: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
  },

  renderMovie: function(movie) {
    return (
      <TouchableWithoutFeedback
          onPress={() => LinkingIOS.openURL(movie.links.alternate)} >
        
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

            <Text style={styles.movieRating}>
              {movie.mpaa_rating}
            </Text>
            
            <Text style={styles.movieSynopsis}>
              {movie.synopsis}
            </Text>
          </View>

        </View>

      </TouchableWithoutFeedback>
    )
  },

});

var styles = StyleSheet.create({
  
  listView: {
    paddingTop: 20,
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
  movieRating: {
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
