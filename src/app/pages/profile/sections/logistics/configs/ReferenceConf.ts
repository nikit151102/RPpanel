export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'api/Entities/Driver',
        pageTitle: 'Водители',
        tableColumns: [
            { label: 'Фамилия', field: 'lastName', type: 'string', width: '20%' },
            { label: 'Имя', field: 'firstName', type: 'string', width: '15%' },
            { label: 'Отчество', field: 'middleName', type: 'string', width: '15%' },
            { label: 'Ставка', field: 'rate', type: 'number', width: '15%' },
            { label: 'Телефон', field: 'phoneNumber', type: 'string', width: '15%' },
            { label: 'Email', field: 'email', type: 'string', width: '20%' },
        ],
        formFields: [
            { label: 'Фамилия', field: 'lastName', type: 'text', required: true, visible: true },
            { label: 'Имя', field: 'firstName', type: 'text', required: true, visible: true },
            { label: 'Отчество', field: 'middleName', type: 'text', required: false, visible: true },
            { label: 'Ставка', field: 'rate', type: 'number', required: true, visible: true },
            { label: 'Дата рождения', field: 'birthday', type: 'date', required: false, visible: true },
            { label: 'Телефон', field: 'phoneNumber', type: 'text', required: false, visible: true },
            // { label: 'Email', field: 'email', type: 'email', required: false, visible: true },
            // { label: 'Статус', field: 'status', type: 'text', required: false, visible: true },
            // { label: 'Транспортная компания', field: 'transportCompany', type: 'text', required: false, visible: true },
            // { label: 'Тариф', field: 'tariff', type: 'text', required: false, visible: true },
            // { label: 'ID аватара', field: 'avatarId', type: 'text', required: false, visible: false },
            // { label: 'URL аватара', field: 'avatarURL', type: 'text', required: false, visible: false },
        ]
    },

    {
        typeId: '592034',
        endpoint: 'api/Entities/Partner',
        pageTitle: 'Контрагенты',
        tableColumns: [
            { label: 'Краткое название', field: 'shortName', type: 'string', width: '20%' },
            { label: 'Полное название', field: 'fullName', type: 'string', width: '25%' },
            { label: 'ИНН', field: 'inn', type: 'string', width: '12%' },
            { label: 'КПП', field: 'kpp', type: 'string', width: '12%' },
            { label: 'Контактное лицо', field: 'lastName', type: 'string', width: '15%' },
            { label: 'Телефон', field: 'phoneNumber', type: 'string', width: '16%' },
        ],
        formFields: [
            { label: 'Краткое название', field: 'shortName', type: 'text', required: true, visible: true },
            { label: 'Полное название', field: 'fullName', type: 'text', required: true, visible: true },
            { label: 'ИНН', field: 'inn', type: 'text', required: true, visible: true },
            { label: 'КПП', field: 'kpp', type: 'text', required: false, visible: true },
            { label: 'ОГРН', field: 'ogrn', type: 'text', required: false, visible: true },
            { label: 'Корреспондентский счет', field: 'korAccount', type: 'text', required: false, visible: true },
            { label: 'Фамилия', field: 'lastName', type: 'text', required: false, visible: true },
            { label: 'Имя', field: 'firstName', type: 'text', required: false, visible: true },
            { label: 'Отчество', field: 'middleName', type: 'text', required: false, visible: true },
            { label: 'Направление деятельности', field: 'workDirection', type: 'text', required: false, visible: true },
            { label: 'Телефон', field: 'phoneNumber', type: 'text', required: false, visible: true },
            { label: 'Email', field: 'email', type: 'email', required: false, visible: true },
            { label: 'Адрес', field: 'address', type: 'text', required: false, visible: true },
            { label: 'Тип контрагента', field: 'partnerType', type: 'text', required: false, visible: true },
        ],
        actions: {
            create: {
                endpoint: 'api/Entities/Partner',
                method: 'POST'
            },
            update: {
                endpoint: 'api/Entities/Partner/{id}',
                method: 'PUT'
            },
            delete: {
                endpoint: 'api/Entities/Partner/{id}',
                method: 'DELETE'
            }
        }
    },
    {
        typeId: '915825',
        endpoint: 'api/Entities/Tariff',
        pageTitle: 'Тарифы',
        tableColumns: [
            { label: 'Тип транспорта', field: 'vehicleType', type: 'string', width: '20%' },
            { label: 'Город', field: 'city', type: 'string', width: '20%' },
            { label: 'Единица измерения', field: 'unit', type: 'string', width: '15%' },
            { label: 'Тип кузова', field: 'bodyType', type: 'string', width: '15%' },
            { label: 'Мин. оплата', field: 'minPayment', type: 'number', width: '10%' },
            { label: 'Мин. объем', field: 'minVolume', type: 'number', width: '10%' },
            { label: 'Макс. объем', field: 'maxVolume', type: 'number', width: '10%' },
        ],
        formFields: [
            { label: 'Тип транспорта', field: 'vehicleType', type: 'text', required: true, visible: true },
            { label: 'Город', field: 'city', type: 'text', required: true, visible: true },
            { label: 'Единица измерения', field: 'unit', type: 'text', required: true, visible: true },
            { label: 'Минимальная оплата', field: 'minPayment', type: 'number', required: true, visible: true, min: 0 },
            { label: 'Минимальный объем', field: 'minVolume', type: 'number', required: true, visible: true, min: 0 },
            { label: 'Максимальный объем', field: 'maxVolume', type: 'number', required: true, visible: true, min: 0 },
            { label: 'Тип кузова', field: 'bodyType', type: 'text', required: false, visible: true },
            { label: 'Описание', field: 'description', type: 'text', required: false, visible: true },
        ]
    },
    {
        typeId: '495142',
        endpoint: 'api/Entities/ProductTarget',
        pageTitle: 'Назначение товара',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'string', width: '10%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '49%' },
            { label: 'Категория', field: 'productTargetCategory', type: 'string', width: '39%' },

        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text', visible: true },
            { label: 'Наименование', field: 'name', type: 'text', visible: true },
            { label: 'Категория', field: 'ProductTargetCategoryId', type: 'dropdown', endpoint: 'api/Entities/ProductTargetCategory/Filter', visible: true },
        ],
    },
    {
        typeId: '103825',
        endpoint: 'api/Entities/Address',
        pageTitle: 'Адреса',
        tableColumns: [
            { label: 'Адрес 1C', field: 'address1c', type: 'string', width: '40%' },
            { label: 'Город', field: 'city', type: 'string', width: '15%' },
            { label: 'Улица', field: 'street', type: 'string', width: '15%' },
            { label: 'Дом', field: 'house', type: 'string', width: '8%' },
            { label: 'Широта', field: 'latitude', type: 'number', width: '11%' },
            { label: 'Долгота', field: 'longitude', type: 'number', width: '11%' },
        ],
        formFields: [
            { label: 'Адрес из 1С', field: 'address1c', type: 'text', required: true, visible: true },
            { label: 'Регион', field: 'region', type: 'text', required: false, visible: true },
            { label: 'Район', field: 'area', type: 'text', required: false, visible: true },
            { label: 'Город', field: 'city', type: 'text', required: false, visible: true },
            { label: 'Улица', field: 'street', type: 'text', required: false, visible: true },
            { label: 'Дом', field: 'house', type: 'text', required: false, visible: true },
            { label: 'Корпус', field: 'housing', type: 'text', required: false, visible: true },
            { label: 'Этаж', field: 'floorNumber', type: 'number', required: false, visible: true },
            { label: 'Офис/Квартира', field: 'office', type: 'text', required: false, visible: true },
            { label: 'Почтовый индекс', field: 'postIndex', type: 'text', required: false, visible: true },
            { label: 'Широта', field: 'latitude', type: 'number', required: false, visible: true, step: 0.000001 },
            { label: 'Долгота', field: 'longitude', type: 'number', required: false, visible: true, step: 0.000001 },
            // { label: 'Система', field: 'system', type: 'text', required: false, visible: true },
        ]
    },
    {
        typeId: '924684',
        endpoint: 'api/Entities/LoadingPlace',
        pageTitle: 'Места погрузок',
        tableColumns: [
            { label: 'Название', field: 'name', type: 'string', width: '30%' },
            { label: 'Контактное лицо', field: 'contactName', type: 'string', width: '20%' },
            { label: 'Телефон', field: 'phone', type: 'string', width: '15%' },
            { label: 'Режим работы', field: 'workHours', type: 'string', width: '20%' },
            { label: 'Примечание', field: 'note', type: 'string', width: '15%' },
        ],
        formFields: [
            { label: 'Название места загрузки', field: 'name', type: 'text', required: true, visible: true },
            { label: 'ID адреса', field: 'addressId', type: 'text', required: true, visible: true },
            { label: 'Контактное лицо', field: 'contactName', type: 'text', required: false, visible: true },
            { label: 'Телефон', field: 'phone', type: 'text', required: false, visible: true },
            { label: 'Режим работы', field: 'workHours', type: 'text', required: false, visible: true },
            { label: 'Примечание', field: 'note', type: 'textarea', required: false, visible: true },
            { label: 'UUID 1С', field: 'uuid1C', type: 'text', required: false, visible: false },
        ]
    },
    {
        typeId: '174208',
        endpoint: 'api/Entities/MeasurementUnit',
        pageTitle: 'Единицы измерения',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'number', width: '20%' },
            { label: 'Наименование', field: 'name', type: 'string', width: '30%' },
            { label: 'Сокращение', field: 'shortName', type: 'string', width: '20%' },
            { label: 'Коэффициент', field: 'coef', type: 'number', width: '20%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'number', required: true, visible: true },
            { label: 'Наименование', field: 'name', type: 'text', required: false, visible: true },
            { label: 'Сокращение', field: 'shortName', type: 'text', required: true, visible: true },
            { label: 'Коэффициент', field: 'coef', type: 'number', required: true, visible: true },
        ],
    },
    {
        typeId: '193453',
        endpoint: 'api/Entities/PartnerBank',
        pageTitle: 'Банки контрагента',
        tableColumns: [
            { label: 'Контрагент', field: 'partner.shortName', type: 'string', width: '30%' },
            { label: 'БИК', field: 'bik', type: 'string', width: '20%' },
            { label: 'Код', field: 'code', type: 'string', width: '15%' },
            { label: 'Полное название', field: 'partner.fullName', type: 'string', width: '35%' },
        ],
        formFields: [
            { label: 'Контрагент', field: 'partnerId', type: 'dropdown', endpoint: 'api/Entities/Partner', required: true, visible: true },
            { label: 'БИК', field: 'bik', type: 'text', required: true, visible: true },
            { label: 'Код', field: 'code', type: 'text', required: false, visible: true },
        ]
    },
    {
        typeId: '193452',
        endpoint: 'api/Entities/PartnerType',
        pageTitle: 'Типы контрагентов',
        tableColumns: [
            { label: 'Код', field: 'code', type: 'number', width: '20%' },
            { label: 'Краткое название', field: 'shortName', type: 'string', width: '20%' },
            { label: 'Полное название', field: 'fullName', type: 'string', width: '60%' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'number', required: true, visible: false },
            { label: 'Краткое название', field: 'shortName', type: 'text', required: true, visible: true },
            { label: 'Полное название', field: 'fullName', type: 'text', required: true, visible: true },
        ]
    }

];