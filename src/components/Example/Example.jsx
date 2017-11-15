import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { extendObservable } from 'mobx';
import FontAwesome from 'react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Example.css'

class Example extends Component {

  constructor() {
    super();
    extendObservable(this, {
      macros: [
        {
          title: 'Init roll with tracker',
          value: `/me macro with init tracker
          [[1d20+2.2&{tracker}]]`,
          copied: false,
        },
        {
          title: 'Saves',
          value: `/me saving throw
          &{template:default}{{name=Save}}{{?{What kind of Save|Fort, Fort [[1d20+@{fort}  ]] |Ref, Ref [[1d20+@{ref}  ]] |Will, Will [[1d20+@{will}  ]]}}}`,
          copied: false,
        },
        {
          title: 'Skills',
          value: `&{template:default}{{name=Skill}}{{?{What kind of Skill
            |Acrobatics, Acrobatics [[1d20+@{acro}]]
            |Climb, Climb [[1d20+@{climb}]]
            |Diplomacy, Diplomacy [[1d20+@{diplo}]]
            |Escape Artist, Escape Artist [[1d20+@{escape}]]
            |Fly, Fly [[1d20+@{fly}]]
            |Heal, Heal [[1d20+@{heal}]]
            |Knowledge (eng.), Knowledge (eng.) [[1d20+@{engine}]]
            |Knowledge (geography), Knowledge (geography) [[1d20+@{geo}]]
            |Knowledge (nature), Knowledge (nature) [[1d20+@{nature}]]
            |Perception, Perception [[1d20+@{perception}]]
            |Profession (Sailor), Profession (Sailor) [[1d20+@{sailor}]]
            |Profession (Fisherman), Profession (Fisherman) [[1d20+@{fisherman}]]
            |Ride, Ride [[1d20+@{Ride}]]
            |Sense motive, Sense motive [[1d20+@{sense}]]
            |Sleight of hand, Sleight of hand [[1d20+@{sleight}]]
            |Spellcraft, Spellcraft [[1d20+@{spellcraft}]]
            |Stealth, Stealth [[1d20+@{stealth}]]
            |Survival, Survival [[1d20+@{survival}]]
            |Swim, Swim [[1d20+@{swim}]] }}}`,
            copied: false,
          },
        ]
      });
    }

    handleCopy(macro) {
      macro.copied = true;
      setTimeout(() => {
        macro.copied = false;
      }, 1000)
    }

    render() {
      const { s } = this.props;
      return (
        <div className="container">
          <div className="row">
            {
              this.macros.map((macro, index) => {
                return <div className="col-md-4" key={index}>
                  <CopyToClipboard text={macro.value} onCopy={(e) => {this.handleCopy(macro)}}>
                    <div className="card clickable">
                      <div className="card-header">{macro.title}</div>
                      <div className="card-body">
                        { macro.copied ?
                          <div className="alert alert-success"><FontAwesome name="check"/> {s.examples.copied}</div>
                          : null }
                          <p>
                            {macro.value}
                          </p>
                        </div>
                      </div>
                    </CopyToClipboard>
                  </div>
                }
              )
            }

          </div>
        </div>
      );
    }
  }

  export default inject('s')(observer(Example));
