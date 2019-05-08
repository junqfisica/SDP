from sqlalchemy import Column, or_, and_
from sqlalchemy.exc import SQLAlchemyError

from flaskapp import db, app_logger
from flaskapp.structures.structures import Search, SearchResult
from flaskapp.http_util.exceptions import AppException


class BaseModel:

    def __init__(self, *args, **kwargs):
        super(BaseModel).__init__(self, *args, **kwargs)

    def to_dict(self):
        """
        Transforms the entity columns into a dictionary. This is equivalent to a Dto.

        Import: This method only converts the Columns fields. For tables with
        relationship, you must extend this method and add the relationships as desired.

        :return: A dictionary representation of the entity's columns.
        """

        # Check if is the right instance.
        if isinstance(self, db.Model):
            # construct a dictionary from column names and values.
            dict_representation = {c.name: getattr(self, c.name) for c in self.__table__.columns}
            return dict_representation
        else:
            raise AttributeError(type(self).__name__ + " is not instance of " + db.Model.__name__)

    @classmethod
    def from_dict(cls, dto):
        """
        Gets a Model from a dictionary representation of it. Usually a Dto.

        :param dto: The data transfer object as a dictionary.
        :return: The model represent this class.
        """
        # Map column names back to structures fields. The keys must be equal to the column name.
        clean_dict = {c.name: dto[c.name] for c in cls.__table__.columns}
        return cls(**clean_dict)

    def save(self):
        """
        Insert or Update the given entity.

        :return: True if succeed, false otherwise.
        """
        try:
            db.session.add(self)
            db.session.commit()
            return True
        except SQLAlchemyError as error_message:
            app_logger.error(error_message)
            return False

    def delete(self):
        """
        Delete the given entity.

        :return: True if succeed, false otherwise.
        """
        try:
            db.session.delete(self)
            db.session.commit()
            return True
        except SQLAlchemyError as error_message:
            app_logger.error(error_message)
            return False

    @classmethod
    def __class_validation(cls):
        """
        Used to validate the class.
        """

        # check if this class is a subClass of Model
        if not issubclass(cls, db.Model):
            raise AttributeError(cls.__name__ + " is not subclass of " + db.Model.__name__)

    @classmethod
    def _get_column_from_name(cls, c_name: str):
        """
        Gets the column in the table for the given c_name.

        :param c_name: The name of the column.
        :return: A table column or None if not found.
        """

        cls.__class_validation()
        for column in cls.__table__.columns:
            if c_name.lower().strip() == column.name:
                return column
        return None

    @classmethod
    def search(cls, search: Search):
        """
        Search for entities based on :class:`Search` criteria.

        :param search: An Search instance.
        :return: A SearchResult instance
        """

        search_columns = []
        for column_name in search.SearchBy.split(","):  # accepts multiple columns split by ,
            search_column = cls._get_column_from_name(column_name)
            if search_column is None:
                raise AppException("The column {} you are trying to search at don't exists.".format(column_name))
            search_columns.append(search_column)

        find_values = []
        for value in search.SearchValue.split(","):  # accepts multiple values split by ,
            find_value = "%{}%".format(value.strip())
            find_values.append(find_value)

        # construct search filter.
        if search.MapColumnAndValue:
            # makes a 1:1 search for column:value
            search_filters = [sc.like(value) for sc, value in zip(search_columns, find_values)]
        else:
            # makes n:x search for column:value
            search_filters = [sc.like(value) for sc in search_columns for value in find_values]

        order_by = cls._get_column_from_name(search.OrderBy)
        if search.OrderDesc and order_by is not None:
            order_by = order_by.desc()

        # AND or OR
        if search.Use_AND_Operator:
            query = cls.query.filter(and_(sf for sf in search_filters)).order_by(order_by)
        else:
            query = cls.query.filter(or_(sf for sf in search_filters)).order_by(order_by)

        page = query.paginate(per_page=search.PerPage, page=search.Page)

        entities = page.items
        total = page.total
        if entities:
            return SearchResult(entities, total)

        return SearchResult([], 0)

    @classmethod
    def find_by_id(cls, entity_id):
        """
        Find by id.

        :param entity_id: The id of the entity.
        :return: The entity if found, None otherwise.
        """

        # Validate class before query
        cls.__class_validation()

        entity = cls.query.get(entity_id)
        if entity:
            return entity

        return None

    @classmethod
    def pagination(cls, per_page, page):
        """
        Get a list of entities using pagination.

        :param per_page: The maximum number entities per page.
        :param page: The current page.
        :return: The list of entities, None otherwise.
        """

        # Validate class before query
        cls.__class_validation()

        entities = cls.query.paginate(per_page=per_page, page=page).items
        if entities:
            return entities

        return None

    @classmethod
    def get_all(cls, order_by: Column = None):
        """
        Get all entities from this model.

        :param order_by: (Optional) The Column to sort the query.
        :return: The list of entities, None otherwise.
        """
        # Validate class before query
        cls.__class_validation()

        if order_by:
            entity_list = cls.query.order_by(order_by).all()
        else:
            entity_list = cls.query.all()

        if entity_list:
            return entity_list

        return None

    @classmethod
    def find_by(cls, get_first: bool = True, **kwarg):
        """
        Find by an specific column name.

        :param get_first: (default=True). If True return one value, otherwise it will try to get
        all entries that match the query.
        :param kwarg: The column name as key and the value to match, e.g username="Jon". If more than one
            filter is given the query will use AND to join it.
            Important: you must pass at least one kwarg to this method, otherwise a ValueError will raise.
        :return: The entity if get_first=True and it exists or a list of entity if get_first=False and exists.
            None, otherwise.
        """
        # Validate class before query
        cls.__class_validation()

        if len([*kwarg]) < 1:
            raise ValueError("find_by must have at least one **kwarg")

        if get_first:
            entity = cls.query.filter_by(**kwarg).first()
        else:
            entity = cls.query.filter_by(**kwarg).all()

        if entity:
            return entity

        return None

    @classmethod
    def total(cls) -> int:
        """
        Get the total number of entities of this model.

        :return: The total number of entities in the database.
        """
        entity_list = cls.query.all()
        if entity_list:
            return len(entity_list)
        return 0
