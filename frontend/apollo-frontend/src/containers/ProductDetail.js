
//file created in https://youtu.be/Zg-bzjZuRa0?t=109

import React from 'react';
import {withRouter} from 'react-router-dom';
import {
  Button,
  Icon,
  Image,
  Item,
  Label,
  Container,
  Segment,
  Loader,
  Dimmer,
  Message,
  Card,
  Grid,
  Header,
  Form,
  Divider,
  Dropdown,
  Select,
  Comment

} from 'semantic-ui-react';

import NumberInput from 'semantic-ui-react-numberinput';

import axios from 'axios';

import {connect} from 'react-redux';


//don't really use this at all
import {productDetailURL, addToCartURL} from '../constants'
import {authAxios} from '../utils';
import {fetchCart} from '../store/actions/cart';




/*
  need to figure out how to give an accurate price for multiple variations
    (it may not be simple addition.. ex: a color & size combination may change based on every different permutation )
    may need to send in an array of every permutation and price associated with it.. this could be a large array tho
    (ex: paracord with 5 different lengths each offered in 12 different colors. potentially 72 different combinations with 72 different prices)
*/




class ProductDetail extends React.Component {


  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
    quantity: '1',

  }

  componentDidMount() {
    this.handleFetchItem();

  }

  //retrieves the product info from the database
  handleFetchItem = () => {
    //had to change this from the tutorials becuase my log was slightly different
    const productID = this.props.match.params.productID;
    this.setState({ loading: true});
    axios
      .get( productDetailURL(productID) )
      .then(res => {
        this.setState({data: res.data, loading: false});
      })
      .catch(err =>{
        this.setState({error: err, loading: false});
      });
  }

  //made at https://youtu.be/qJN1_2ZwqeA?t=1386
  handleFormatData = (formData) => {
    //returns the keys of the formData array becuase that is what the backend is expecting
    //convert {color: 1, size:2} to [1,2]
    return Object.keys(formData).map(key =>{
      return formData[key];
    })
  }



  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    const {formData} = this.state;
    //filters  the data into the correct format fot the backend
    const variations = this.handleFormatData(formData);
    //authAxios makes sure that the user is signed in before adding to cart... just use axios for adding to cart while signed out
    authAxios
    .post( addToCartURL , { slug, variations } )
    .then(res => {
      //console.log(res.data, addToCartURL, "add to cart succeeded");
      this.props.fetchCart();
      this.setState({ loading: false });
    })
    .catch(err => {
      this.setState({ error: err, loading: false });
      //console.log(err , 'add-to-cart failed ');
    });
  }


  handleChange = (e, {name, value}) => {
    //made around https://youtu.be/qJN1_2ZwqeA?t=1126
    const {formData} = this.state
    const updatedFormData = {
      //spread of the formData
      ...formData,
      //changes the name of the key to be the value (this is for passing info to the backend.. ex. changes the name "red" to 1)
      [name]: value
    }
    this.setState({
      formData: updatedFormData
    })

  }


  //used to increase the product quantity in the State 
  changeValue = (newValue) => {
        this.setState({ quantity: newValue });
  }




  render() {


      const {
          data,
          error,
          formData,
          formVisible,
          loading,
          quantity,
        } = this.state;


      return (

        <Container>
            {
              //if there's an error then display a message component
              error &&
              (
                <Message
                  error
                  header='There was some errors with your submission'
                  content={ JSON.stringify(error) }
                />
              )
            }

            {
              //if loading is true then render the loader component
              //if false, render the page content (product info, add-to-cart widget)
              loading ?
              (
                <Segment>
                    <Dimmer active inverted>
                      <Loader inverted>Loading</Loader>
                    </Dimmer>

                    <Image src='/images/wireframe/short-paragraph.png' />
                </Segment>
              )
              :
              (


                <Grid columns={2} celled>
                    {/*column for displaying the product info AND reviews*/}
                    <Grid.Column width={12}>
                      {/*Row for the product information*/}
                      <Grid.Row>
                        {/*column for the images & title*/}
                        <Grid.Column >

                          <Container >
                            {/*card for holding the name of the product and it's price*/}
                            <Card>
                              <Card.Content>
                                <Header >
                                  {data.title}
                                </Header>
                                <Container textAlign='left'>
                                  <Card.Description>
                                    {
                                      data.discount_price !== null ? (
                                         <React.Fragment>
                                          <span className='price' style={{ textDecorationLine: 'line-through' }}>${data.price}</span>
                                          <span className='stay' >{data.discount_price}</span>
                                        </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <span className='price' >${data.price}</span>
                                        </React.Fragment>
                                      )
                                    }
                                  </Card.Description>

                                </Container>
                              </Card.Content>
                            </Card>
                          </Container>


                          <Card>
                            <Image src={data.image} />
                            <Card.Content>
                              <Card.Description>
                                try to put a image carousel in here for multiple images
                              </Card.Description>
                            </Card.Content>
                          </Card>


                        </Grid.Column>


                        <Divider />
                        {/*Column for displaying the item description*/}
                        <Grid.Column>
                          <Header>
                            Product Information
                          </Header>
                          <Container text>
                            <Item.Description>{data.description}</Item.Description>
                          </Container>

                        </Grid.Column>

                      </Grid.Row>


                      <Divider/>




                      {/*row to hold the comments data*/}
                      <Grid.Row >

                        <Container fluid >
                          <Comment.Group >
                            <Header as='h3' dividing>
                              Customer Reviews
                            </Header>

                            <Comment>
                              <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                              <Comment.Content>
                                <Comment.Author as='a'>User 1</Comment.Author>
                                <Comment.Metadata>
                                  <div>Today at 5:40PM</div>
                                </Comment.Metadata>
                                <Icon name='star' /> <Icon name='star' /> <Icon name='star' /> <Icon name='star' /> <Icon name='star' />
                                <Comment.Text>This is an amazing smart speaker!! I love it and it makes a great addition to our home! I already have ordered another one and you should too!</Comment.Text>
                                <Comment.Actions>
                                  <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                              </Comment.Content>
                            </Comment>
                            <Comment>
                              <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                              <Comment.Content>
                                <Comment.Author as='a'>User 2</Comment.Author>
                                <Comment.Metadata>
                                  <div>Today at 5:42PM</div>
                                </Comment.Metadata>
                                <Icon name='star' />
                                <Comment.Text>I hate this smart speaker, it is constantly listening in on my conversations and I can tell that it is judging me!</Comment.Text>
                                <Comment.Actions>
                                  <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                              </Comment.Content>
                            </Comment>

                          </Comment.Group>
                        </Container>

                      </Grid.Row>










                    </Grid.Column>


                    {/*Column for holding the add-to-cart widget and the different variations of the product*/}
                    <Grid.Column width={4}>

                      <Card>
                        <Card.Content>

                          <Card.Header>Quantity:</Card.Header>
                          <NumberInput  float='right' size='mini' value={this.state.quantity} minValue={1}  onChange={this.changeValue} doubleClickStepAmount={3} />

                        </Card.Content>
                        <Card.Content extra>

                          <Button
                            fluid
                            basic
                            color='green'
                            onClick={ () => this.handleAddToCart(this.state.data.slug) }
                          >
                            Add to Cart
                          </Button>

                        </Card.Content>
                      </Card>



                      {/* "if variations exists, then display this for every variation" */}
                      <Card>
                        {
                          data.variations &&
                          (
                            data.variations.map(variation => {
                              return(
                                <Card.Content>
                                  <Card.Header>{variation.name}</Card.Header>
                                  <Form.Field>
                                    <Select
                                      fluid
                                      name={variation.name}
                                      onChange={this.handleChange}
                                      options={
                                          variation.item_variations.map(item=>{
                                            return {
                                              key: item.id,
                                              text: `${item.value}`,
                                              value: item.id,
                                            }
                                          })
                                        }
                                      placeholder={`choose a ${variation.name}`}
                                      selection
                                      value={formData[variation.name]}
                                    />
                                  </Form.Field>
                                </Card.Content>
                              )
                            })
                          )
                        }
                      </Card>

                    </Grid.Column>
                </Grid>

              )
            }
          </Container>

    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart()),


  }
}

export default
  withRouter(
    connect(
      null,
      mapDispatchToProps
    )
    (ProductDetail)
  );
