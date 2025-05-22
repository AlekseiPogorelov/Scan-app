import axios from 'axios';

const API_URL = 'https://gateway.scan-interfax.ru/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      alert('Нет соединения с сервером');
    } else if (error.response.status >= 500) {
      alert('Ошибка сервера');
    }
    return Promise.reject(error);
  }
);

async function authorizedFetch(endpoint, options = {}) {
  // Используем токен из localStorage для авторизации
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Собираем полный URL с использованием API_URL
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    // Улучшена обработка ошибок: пробуем получить текст ошибки из ответа
    let errorMessage = 'Ошибка запроса';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }
  return response.json();
}

// АВТОРИЗАЦИЯ
export async function loginApi(login, password) {
  const response = await api.post('/account/login', { login, password });
  return response.data;
}

// ЛИМИТЫ
export async function getLimitsApi(token) {
  const response = await api.get('/account/info', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = response.data;
  return {
    used: data.eventFiltersInfo.usedCompanyCount,
    total: data.eventFiltersInfo.companyLimit,
  };
}

//  ПОИСК
export function buildSearchRequest(form) {
  return {
    issueDateInterval: {
      startDate: `${form.dateStart}T00:00:00+03:00`,
      endDate: `${form.dateEnd}T23:59:59+03:00`
    },
    searchContext: {
      targetSearchEntitiesContext: {
        targetSearchEntities: [
          {
            type: "company",
            sparkId: null,
            entityId: null,
            inn: form.inn,
            maxFullness: form.maxCompleteness,
            inBusinessNews: form.businessContext || null,
          }
        ],
        onlyMainRole: form.mainRole,
        tonality: form.tonality,
        onlyWithRiskFactors: form.onlyWithRiskFactors,
        riskFactors: { and: [], or: [], not: [] },
        themes: { and: [], or: [], not: [] }
      },
      themesFilter: { and: [], or: [], not: [] }
    },
    searchArea: {
      includedSources: [],
      excludedSources: [],
      includedSourceGroups: [],
      excludedSourceGroups: []
    },
    attributeFilters: {
      excludeTechNews: !form.includeTechNews,
      excludeAnnouncements: !form.includeAnnouncements,
      excludeDigests: !form.includeDigests
    },
    similarMode: "duplicates",
    limit: Number(form.limit) || 1000,
    sortType: "sourceInfluence",
    sortDirectionType: "desc",
    intervalType: "month",
    histogramTypes: ["totalDocuments", "riskFactors"]
  };
}

//  ГИСТОГРАММЫ
export async function fetchHistograms(params, token) {
  // Получение гистограмм публикаций и рисков через axios
  const response = await api.post('/objectsearch/histograms', params, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// ID ДОКУМЕНТОВ
export async function fetchDocumentIds(params, token) {
  // Получение списка ID документов по поисковому запросу через axios
  const response = await api.post('/objectsearch', params, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Возвращаем только массив ID
  return (response.data.items || []).map(item => item.encodedId);
}

// СОДЕРЖИМОЕ ДОКУМЕНТОВ
export async function fetchDocuments(ids, token) {
  // Получение документов по массиву ID через axios
  const response = await api.post('/documents', { ids }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Возвращаем массив объектов публикаций
  return response.data.map(item => item.ok);
}
