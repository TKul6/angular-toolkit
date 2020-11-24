import {ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {Component, DebugElement, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import { ANGULAR_TOOLKIT_WIDTH_BY_TEXT_CONFIGURATION, WidthByTextConfiguration } from './width-by-text.configuration';
import { DataRefreshStrategy } from './data-refresh-strategy';
import { WidthByTextDirective } from './width-by-text.directive';
import { ANGULAR_TOOLKIT_EMIT_ISSUES } from '../../public-api';



describe('width by text directive', () => {

  let component: WidthByTextComponentTest;
  let fixture: ComponentFixture<WidthByTextComponentTest>;

  let headerCellElement: DebugElement;


  const TEXT = 'TEXT';
  const LONGEST_STRING = {text: 'this is a very long string'};

  const CONFIG: WidthByTextConfiguration = {paddingRight: 0, paddingLeft: 0, font: '14px Roboto', refreshStrategy: DataRefreshStrategy.Ignore,
  headerFont: 'bold 14px Roboto'};


  describe('updating data', () => {

    it('should update the cell width when getting new data', () => {

      // Arrange
      initTestBed(CONFIG);

      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}, LONGEST_STRING];
      const longestLength = computeStringLength(LONGEST_STRING.text);

       // Act

      fixture.detectChanges();

      // Assert
      expect(headerCellElement.styles['width']).toEqual(`${longestLength}px`);


    });

    it('should update the width based on the data if the config does not ignore changes.', () => {

      // Arrange
      initTestBed({refreshStrategy: DataRefreshStrategy.Update, paddingLeft: 0});

      //  Making sure the data already exists in the directive.
      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}];

      fixture.detectChanges();

      const newLongestStringLength = computeStringLength(LONGEST_STRING.text);

      // Act
      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}, LONGEST_STRING];

      fixture.detectChanges();

      // Assert
      expect(headerCellElement.styles['width']).toEqual(`${newLongestStringLength}px`);
    });

    it('should ignore data changes if the config is set to ignore.', () => {

      // Arrange
      initTestBed({refreshStrategy: DataRefreshStrategy.Ignore, paddingLeft: 0});

      //  Making sure the data already exists in the directive.
      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}];

      fixture.detectChanges();

      const initialWidth = headerCellElement.styles['width'];

      // Act

      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}, LONGEST_STRING];

      fixture.detectChanges();

      // Assert
      expect(headerCellElement.styles['width']).toEqual(initialWidth);
    });

  [true, false].forEach((logIssues: boolean) =>
  [[], null].forEach((data: Array<any>) =>
  it('should emit warning if the data provided is null or empty.', () => {

    // Arrange

    const warnSpy = spyOn(console, 'warn');

    initTestBed({refreshStrategy: DataRefreshStrategy.Update, paddingLeft: 0}, logIssues);

    //  Arrange
    component.data = data;

    // Act
    fixture.detectChanges();

    // Assert
    expect(warnSpy.calls.any()).toBe(logIssues);

  })));
  });

  describe('header', () => {

    it('should change the width if it is longer than the entire data items', () => {

      // Arrange
      initTestBed(CONFIG);

      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}];
      const longestLength = computeStringLength(LONGEST_STRING.text, CONFIG.headerFont);
      component.header = LONGEST_STRING.text;

      // Act

      fixture.detectChanges();

      // Assert
      expect(headerCellElement.styles['width']).toEqual(`${longestLength}px`);

    });

    it('should change the width based on the data if the header becomes shorter than the text', () => {

      // Arrange
      initTestBed(CONFIG);

      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}];

      component.header = LONGEST_STRING.text;
      fixture.detectChanges();

      const length = computeStringLength(TEXT);

      // Act
      component.header =  't';

      fixture.detectChanges();

      // Assert
      expect(headerCellElement.styles['width']).toEqual(`${length}px`);

    });

  });

  describe('memberName', () => {

    [false, true]
      .forEach((emitIssues: boolean) =>
    [null, ''].forEach((memberName: string) =>
    it('should handle null or empty memberName.', () => {
      // Arrange
      const warnSpy = spyOn(console, 'warn');
      initTestBed(CONFIG, emitIssues);

      component.memberName = memberName;

      component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}];
      component.header = LONGEST_STRING.text;

      // Act

      fixture.detectChanges();

      // Assert
      expect(headerCellElement.styles['width']).toEqual(``);
      expect(warnSpy.calls.any()).toBe(emitIssues);

    })));

    [false, true]
      .forEach((emitIssues: boolean) =>
          it('should handle null or empty memberName.', () => {
            // Arrange
            const warnSpy = spyOn(console, 'warn');
            initTestBed(CONFIG, emitIssues);

            component.memberName = 'a member that does not exists in object';

            component.data = [{text: TEXT}, {text: TEXT}, {text: TEXT}, {text: TEXT}];
            component.header = LONGEST_STRING.text;

            // Act
            fixture.detectChanges();

            // Assert
            expect(headerCellElement.styles['width']).toEqual(``);
            expect(warnSpy.calls.any()).toBe(emitIssues);

          }));

  });

  describe('transform function', () => {

    it('should compute string from an object', () => {

      // Arrange
      initTestBed(CONFIG);

      component.header = 'h';

      component.transformer = (data: StringItem) => {
        return data.text.toString();
      };

      const highestNumber = 1111;

      component.data = [{text: 1}, {text: 11}, {text: 1111}, {text: highestNumber}];

      const longestLength = computeStringLength(highestNumber.toString());

      // Act

      fixture.detectChanges();

      // Assert
      expect(headerCellElement.styles['width']).toEqual(`${longestLength}px`);


    });

  });

  describe('configuration', () => {

    it('should handle no configuration is provided', () => {

      TestBed.configureTestingModule({
        imports: [],
        declarations: [WidthByTextComponentTest, WidthByTextDirective]
      }).compileComponents();

      const testBed = getTestBed();

      fixture = testBed.createComponent(WidthByTextComponentTest);

      expect(fixture.componentInstance).toBeTruthy();

    });

  });

  function initTestBed (config: Partial<WidthByTextConfiguration>, emitWarnings = false) {

    TestBed.configureTestingModule({
      declarations:  [WidthByTextComponentTest, WidthByTextDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{provide: ANGULAR_TOOLKIT_WIDTH_BY_TEXT_CONFIGURATION, useValue: config},
    {provide: ANGULAR_TOOLKIT_EMIT_ISSUES, useValue: emitWarnings}]
    }).compileComponents();

    const testBed = getTestBed();

    fixture = testBed.createComponent(WidthByTextComponentTest);

    component = fixture.componentInstance;

    headerCellElement = fixture.debugElement.query(By.css('th'));

    fixture.detectChanges();

  }

  });

function computeStringLength(text: string, font = '14px Roboto'): number {

  const context = document.createElement('canvas').getContext('2d');

  context.font = font;

  return Math.round(context.measureText(text).width);
}


@Component({
    selector: 'at-width-by-text-test-component',
    template: '<table><thead><tr><th [atWidthByText]="memberName" [data]="data" [headerText]="header">{{header}}</th></tr></thead>' +
      '<tbody><tr *ngFor="let item of data"><td>{{item.text}}</td></tr></tbody></table>',
  
  })
 class WidthByTextComponentTest {
  
    @Input()
    header = 'header';
  
    @Input()
    data = new Array<StringItem>();
  
    @Input()
    memberName = 'text';
  
    @Input()
    transformer: (data: any) => string;
  
    constructor() { }
  
  
  }
  
  export interface StringItem {
  
    text: string | number;
  
  }
  

