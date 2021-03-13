import {
  GraphQLScalarType
} from 'graphql';

const dateValue = (value: any) => {
  if (value instanceof Date) {
    return +value;
  }
}

const DateType = new GraphQLScalarType({
  name: 'Date',
  serialize: dateValue,
  parseValue: dateValue,
  parseLiteral(ast) {
    return dateValue((ast as any).value);
  }
});

export default DateType;