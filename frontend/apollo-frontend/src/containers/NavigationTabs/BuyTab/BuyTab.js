
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
    activeDisplayItemsByCategory: 'Featured'
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
    })
    .catch(error => {
      this.setState({error: error , loading: false})
    })
  }



  handleDisplayViewItemsByCategory = (e, data) => {
    let cat = ''
    switch (data.content){
      case 'Featured':
        break;
      case 'Technology':
        cat = 'T'
        break;
      case 'Outdoors':
        cat = 'OD'
        break;
      case 'Apparel':
        cat = 'A'
        break;
      case 'Books':
        cat = 'B'
        break;
      case 'Miscellaneous':
        cat = 'M'
        break;
      default:
        return 'error'

    }
    axios
    .get(productSearchByCategoryURL, {
      params: {
        category: cat
        }
      })
    .then(response => {
      console.log('response.data: :' , response.data,)
      this.setState({
          data: response.data,
          loading: false,
          //productsTitle: `Search results for "${search}" [${response.data.length}]`}
        });

    })
    .catch(error => {
      this.setState({
        error: error,
        loading: false
      });
    })

    console.log('data: ', data)
    this.setState({
      activeDisplayItemsByCategory: data.content
    })
  }



  displayCategory = () => {
    switch(this.state.activeDisplayItemsByCategory){
      case 'Featured':
        return(
          <FeaturedItems />
        )
        break;
      case 'Outdoors':
        return(
          <div>
            OUTDOORS
          </div>
        )
      default:
        console.log('something went wrong when selecting a category')
    }
  }


  render(){

    const {
      data,
      error,
      loading,

      allCategories,
      activeDisplayItemsByCategory,

     } = this.state;


    return(

      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <Input
              fluid
              label={
                <Dropdown
                  defaultValue='all'
                  options={[
                    { key: '0', text: 'All Categories', value: 'all' },
                    { key: '1', text: 'Outdoors', value: 'Outdoors' },
                    { key: '2', text: 'Apparel', value: 'Apparel' },
                    { key: '3', text: 'Books', value: 'Books' },
                    { key: '4', text: 'Miscelaneous', value: 'Miscelaneous' },
                    { key: '5', text: 'Technology', value: 'Technology' },
                  ]}
                />
              }
              icon='search'
              placeholder='Search for an item...'
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
            this.displayCategory()
          }
          {/*this is the FeaturedItems Component*/}

        </Grid.Row>
      </Grid>
    //ends the return statement
    )
  }
}


export default BuyTab
