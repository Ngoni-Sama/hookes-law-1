// Copyright 2002-2015, University of Colorado Boulder

/**
 * The robotic arm used to pull the spring.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HookesLawConstants = require( 'HOOKES_LAW/common/HookesLawConstants' );
  var HookesLawQueryParameters = require( 'HOOKES_LAW/common/HookesLawQueryParameters' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // images
  var hingeImage = require( 'image!HOOKES_LAW/robotic-arm-hinge.png' );
  var hookImage = require( 'image!HOOKES_LAW/robotic-arm-hook.png' );

  // constants
  var SHOW_ORIGIN = HookesLawQueryParameters.DEV;

  /**
   * @param {Spring} spring
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function RoboticArmNode( spring, modelViewTransform, options ) {

    options = _.extend( {
      cursor: 'pointer'
    }, options );

    var thisNode = this;

    var hookNode = new Image( hookImage, {
      scale: 0.4,
      left: -7, // dependent on image file, so that origin is in center of hook tip
      bottom: 16 // dependent on image file
    } );

    var hingeNode = new Image( hingeImage, {
      scale: 0.4,
      left: hookNode.right - 14, // dependent on image file
      centerY: 0 // dependent on image file
    } );

    options.children = [ hookNode, hingeNode ];

    if ( SHOW_ORIGIN ) {
      options.children.push( new Circle( 3, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // Drag the hook or hinge to change displacement
    var dragHandler = new SimpleDragHandler( {

        allowTouchSnag: true,

        startOffsetX: 0,  // where the drag started relative to locationProperty, in parent view coordinate

        start: function( event ) {
          var locationX = modelViewTransform.modelToViewX( spring.lengthProperty.get() );
          this.startOffsetX = event.currentTarget.globalToParentPoint( event.pointer.point ).x - locationX;
        },

        drag: function( event ) {
          var parentX = event.currentTarget.globalToParentPoint( event.pointer.point ).x - ( this.startOffsetX );
          var displacement = modelViewTransform.viewToModelX( parentX ) - spring.equilibriumX;
          // constrain to delta increment
          displacement = Math.round( displacement / HookesLawConstants.DISPLACEMENT_DELTA ) * HookesLawConstants.DISPLACEMENT_DELTA;
          // constrain to range
          displacement = Math.max( Math.min( displacement, spring.getMaxDisplacement() ), spring.getMinDisplacement() );
          spring.displacementProperty.set( displacement );
        },

        end: function( event ) {}
      }
    );
    this.addInputListener( dragHandler );

    spring.lengthProperty.link( function( length ) {
      thisNode.x = modelViewTransform.modelToViewX( length );
    } );
  }

  return inherit( Node, RoboticArmNode );
} );