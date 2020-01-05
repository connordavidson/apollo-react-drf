
import React from 'react';
import {
  Grid,
  Segment,
  Header,
  Item,
  Label,
  Button,
  Card,
  Divider,
  Dimmer,
  Loader,
  Image,
  Input,
  Checkbox,
  Icon,
  Message,
  Dropdown,
  Container,

} from 'semantic-ui-react';
import axios from 'axios';

//lets you recieve props from the parent component (in this case, NavigationTabs.js)
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';


import {
    addItemToCart
  } from '../../../store/actions/cart';

import {
    productListURL,
    addToCartURL,
    productSearchListURL,
    categoryListURL,
    productSearchByCategoryURL,

  } from '../../../constants';

import FeaturedItems from './FeaturedItems'
import CategoryItems from './CategoryItems'
/*
WORK TO BE DONE:
  make a 'product item' component so that it can just get passed into the loops that create all the active items, instead of having all that code twice

*/




class BuyTab extends React.Component {


  state = {
    loading: false,
    error: null,
    data: [],

    allCategories: [],
    activeDisplayItemsByCategory: 'Featured',
    categoryArrayForSearchBar : [],

    activeSearchBarCategory : 'All'
  }


  componentDidMount() {
    this.setState({
      loading: true
    });

    this.handleGetCategories();

  };





  //if the user presses enter on the search bar, it'll search for the value (currently stored in this.state.value)
  handleSearchEnterPress = (event) => {
    //this.setState({value: data.value});
    //console.log('data from handleSearchEnterPress: ', data)
    let search = this.state.value

    // console.log('search from handleSearchEnterPress: ', search)
    if (event.key === "Enter") {
      //if the user hits enter (tries to search) then return the search results.. need to change the views.py for this a little bit
      axios
      .get(productSearchListURL, {
        params: {
          search: search
          }
        })
      .then(response => {
        //if the search bar is empty, make the title say 'featured products'
        //the issue is if the user searches for something, then erases it from the search bar and hits enter it'll say 'search results for "" []' when it is displaying the featured products
        if(search === ''){
          this.setState(
            {
              data: response.data,
              loading: false,
              productsTitle: 'Featured Items'}
          );
        }else{
          this.setState(
            {
              data: response.data,
              loading: false,
              productsTitle: `Search results for "${search}" [${response.data.length}]`}
          );
        }
      })
      .catch(error => {
        this.setState({
          error: error,
          loading: false
        });
      })
    }
  }

  handleGetCategories = () => {
    axios
    .get(categoryListURL)
    .then( response => {
      this.setState({allCategories: response.data, loading: false})
      this.makeCategoryArray(response.data)
    })
    .catch(error => {
      this.setState({error: error , loading: false})
    })
  }



  handleDisplayViewItemsByCategory = (e, data) => {

    //sets the state.activeDisplayItemsByCategory to be the name of the button that was clicked
    console.log('data.content: ', data)
    this.setState({
      activeDisplayItemsByCategory: data.content
    })
  }



  displayCategory = (activeDisplayItemsByCategory, allCategories) => {

    if(activeDisplayItemsByCategory === 'Featured'){
      return(
        <FeaturedItems allCategories={allCategories}/>
      )
    }else{
      return(
        <CategoryItems category={activeDisplayItemsByCategory} />
      )
    }
  }

  //creates the array that the searchbar dropdown reads from
  makeCategoryArray = (categories) => {
    let formattedCategories = [
      { key: 0, text: 'All Categories', value: 'all' }
    ]

    for(let i = 0 ; i < categories.length ; i++){
      console.log('categories[i].category: ', categories[i].category)
      formattedCategories.push({key: i , text: categories[i].category , value: categories[i].category})
    }


    this.setState({categoryArrayForSearchBar: formattedCategories , loading: false})

  }



  handleSearchDropdownChange = (e, { value }) => {
    this.setState({loading: true})
    console.log(value);
    this.setState({activeSearchBarCategory : value , loading: false })
  }


  render(){

    const {
      data,
      error,
      loading,

      allCategories,
      activeDisplayItemsByCategory,
      categoryArrayForSearchBar,

      activeSearchBarCategory
     } = this.state;


    return(

      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <Input
              fluid
              label={
                <Dropdown
                  onChange={this.handleSearchDropdownChange}
                  defaultValue='all'
                  options={categoryArrayForSearchBar}
                />
              }
              icon='search'
              placeholder='search...'
              onKeyPress={this.handleSearchEnterPress}
              onChange={
                //sets the search value into the value in the state
                (e,data)=>{
                  this.setState({value: data.value});
                }
              }
            />
          </Grid.Column>
        </Grid.Row>


        {/*this is for the "all categories" button group*/}
        <Grid.Row>
          <Grid.Column>
            <Button compact basic >
             View by Category:
            </Button>

            <Button.Group>
              <Button
                compact
                content='Featured'
                active={activeDisplayItemsByCategory === 'Featured'}
                onClick={(e, data) => {
                  this.handleDisplayViewItemsByCategory(e, data)
                }}
              />

              {
                allCategories.map(category => {
                  //console.log('category' , category)
                  return(
                    <Button
                      compact
                      content={category.category}
                      active={activeDisplayItemsByCategory === category.category}
                      onClick={(e, data) => {
                        this.handleDisplayViewItemsByCategory(e, data)
                      }}
                    />
                  )
                })
              }
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
        <Divider />


        <Grid.Row>
          {
            this.displayCategory(activeDisplayItemsByCategory, allCategories)
          }
        </Grid.Row>
      </Grid>
    //ends the return statement
    )
  }
}


export default BuyTab
