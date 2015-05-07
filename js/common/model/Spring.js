// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a spring.
 *
 * F = kx, where:
 *
 * F = applied force, N/m
 * k = spring constant, N/m
 * x = displacement from equilibrium position, m
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Spring( options ) {

    options = _.extend( {
      x: 0, // {number} x location of the left end of the spring, units = m, read-only
      equilibriumX: 1.5, // {number} x location of equilibrium, units = m, read-only
      springConstant: 200,
      springConstantRange: new Range( 100, 1000 ), // N/m
      appliedForceRange: new Range( -100, 100 ) // N
    }, options );
    assert && assert( options.springConstantRange.contains( options.springConstant ), 'springConstant out of range: ' + options.springConstant );

    this.x = options.x; // read-only
    this.equilibriumX = options.equilibriumX; // read-only
    this.springConstantRange = options.springConstantRange; // read-only
    this.appliedForceRange = options.appliedForceRange; // read-only

    var thisSpring = this;

    // For internal validation, x = F/k
    var displacementRange = new Range( this.appliedForceRange.min / this.springConstantRange.min, this.appliedForceRange.max / this.springConstantRange.min );

    PropertySet.call( this, {
      springConstant: options.springConstant,  // {number} k, spring constant, units = N/m
      appliedForce: 0, // {number} F, force applied to the spring, units = N
      displacement: 0  // {number} x, horizontal displacement from equilibrium position, units = m
    } );

    // length of the spring, units = m
    this.lengthProperty = new DerivedProperty( [ this.displacementProperty ], function( displacement ) {
      return thisSpring.equilibriumX + displacement;
    } );

    // spring force opposes the applied force, units = N
    this.springForceProperty = new DerivedProperty( [ this.appliedForceProperty ], function( appliedForce ) {
      return -appliedForce;
    } );

    this.springConstantProperty.link( function( springConstant ) {
      assert && assert( thisSpring.springConstantRange.contains( springConstant ), 'springConstant out of range: ' + springConstant );
      thisSpring.displacement = thisSpring.appliedForce / springConstant; // x = F/k
    } );

    this.appliedForceProperty.link( function( appliedForce ) {
      assert && assert( thisSpring.appliedForceRange.contains( appliedForce ), 'appliedForce out of range: ' + appliedForce );
      thisSpring.displacement = appliedForce / thisSpring.springConstant; // x = F/k
    } );

    this.displacementProperty.link( function( displacement ) {
      assert && assert( displacementRange.contains( displacement ), 'displacement out of range: ' + displacement );
      thisSpring.appliedForce = thisSpring.springConstant * displacement; // F = kx
    } );
  }

  return inherit( PropertySet, Spring, {

    // Gets the current maximum displacement, x = F/k. Used to constrain dragging.
    getMaxDisplacement: function() {
      return this.appliedForceRange.max / this.springConstantProperty.get();
    },

    // Gets the current minimum displacement, x = F/k. Used to constrain dragging.
    getMinDisplacement: function() {
      return this.appliedForceRange.min / this.springConstantProperty.get();
    }
  } );
} );
